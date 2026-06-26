
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, BellOff } from 'lucide-react';
import { onSnapshot, collection, getFirestore, query, where } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence } from 'firebase/auth';

import AdminSidebar from '@/components/admin-sidebar';
import { useAuthStore } from '@/store/auth';
import { useToast } from '@/hooks/use-toast';
import { getFirebaseApp } from '@/lib/firebase';
import { ADMIN_USER_UIDS } from '@/lib/admins';
import { AlarmProvider, useAlarm } from '@/context/alarm-context';
import { Button } from '@/components/ui/button';

// O conteúdo principal do layout, que agora consome o contexto de alarme
function AdminContent({ children }: { children: React.ReactNode }) {
    const { isRinging, stopRinging } = useAlarm();

    return (
        <>
            {isRinging && (
                <div className="fixed top-4 right-4 z-50 no-print">
                    <Button onClick={stopRinging} variant="destructive" size="lg" className="flex items-center gap-2 animate-pulse">
                        <BellOff className="h-5 w-5"/>
                        Silenciar Alarme
                    </Button>
                </div>
            )}
            <main className="flex-1 p-8 bg-muted/30">
                {children}
            </main>
        </>
    );
}

// O Layout principal que agora age como o controlador do alarme
function AdminLayoutController({ children }: { children: React.ReactNode }) {
  const { user, setUser, isAuthLoading, logout } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();
  
  const { startRinging, initAudio } = useAlarm();
  const app = getFirebaseApp();

  // EFEITO DE AUTENTICAÇÃO CENTRALIZADO E ROBUSTO
  useEffect(() => {
    if (!app) {
        setUser(null, false);
        return;
    }
    const auth = getAuth(app);
    
    // Garante que a persistência seja definida ANTES de registrar o listener.
    // Isso instrui o Firebase a lembrar do usuário entre as sessões.
    setPersistence(auth, browserLocalPersistence).then(() => {
        console.log("🔥 Persistência de autenticação definida como local.");
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          console.log("🔥 Estado do usuário mudou:", firebaseUser ? firebaseUser.email : "Nenhum usuário");
          if (firebaseUser) {
            // O usuário está logado no Firebase Auth.
            // Verificamos se ele é um administrador.
            const isUserAdmin = ADMIN_USER_UIDS.includes(firebaseUser.uid);
            
            if (isUserAdmin) {
               // A sessão é válida e o usuário é um admin.
               // Atualizamos nosso estado global. O SDK do Firebase cuidará da renovação do token.
               setUser(firebaseUser, false);
            } else {
              // O usuário está logado, mas não é um admin.
              toast({
                  title: "Acesso Negado",
                  description: "Você não tem permissão para acessar o painel de administração.",
                  variant: "destructive",
              });
              await logout(); // Realiza o logout no Firebase Auth
              router.replace('/login');
            }
          } else {
            // Não há usuário logado no Firebase Auth.
            setUser(null, false);
            router.replace('/login');
          }
        });

        // Limpa o listener quando o componente é desmontado
        return () => unsubscribe();

    }).catch(error => {
        console.error("Erro crítico ao definir a persistência de autenticação:", error);
        toast({
            title: "Erro de Configuração",
            description: "Não foi possível configurar a persistência da sessão.",
            variant: "destructive"
        });
        setUser(null, false);
    });
      
  }, [app, setUser, router, toast, logout]);
  

  // Efeito para configurar o listener de novos pedidos
  useEffect(() => {
    if (!user || !app) return; // Só roda se o usuário for um admin logado

    const db = getFirestore(app);
    
    // Consulta otimizada: ouve apenas pedidos novos com status 'pending'
    const ordersQuery = query(
      collection(db, "orders"),
      where("status", "==", "pending")
    );

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
        // Itera sobre as mudanças detectadas
        snapshot.docChanges().forEach((change) => {
            // Se um NOVO pedido foi adicionado, toca o alarme
            if (change.type === "added") {
                console.log("[NOVO PEDIDO] Alarme disparado para o pedido:", change.doc.id);
                startRinging();
            }
        });
    }, (error) => {
        console.error("[ERRO DE LISTENER DE PEDIDOS]:", error);
        toast({
            title: "Erro de Conexão",
            description: "Não foi possível monitorar novos pedidos em tempo real.",
            variant: "destructive",
        });
    });

    return () => unsubscribe();
  }, [user, app, startRinging, toast]);

   // Efeito para inicializar o áudio na primeira interação do usuário após o login
  useEffect(() => {
    if (!user) return; // Só roda se o usuário estiver logado

    const handleFirstUserInteraction = () => {
      initAudio();
      // Remove o listener após a primeira interação para não rodar de novo
      window.removeEventListener('click', handleFirstUserInteraction);
      window.removeEventListener('keydown', handleFirstUserInteraction);
    };

    // Adiciona listeners para a primeira interação (clique ou tecla)
    window.addEventListener('click', handleFirstUserInteraction);
    window.addEventListener('keydown', handleFirstUserInteraction);

    return () => {
      window.removeEventListener('click', handleFirstUserInteraction);
      window.removeEventListener('keydown', handleFirstUserInteraction);
    };
  }, [user, initAudio]); // Depende do usuário e da função initAudio

  
  if (isAuthLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Verificando permissões...</span>
      </div>
    );
  }

  // O clique para inicializar o áudio foi movido para um local mais apropriado (ex: botão de refresh em orders)
  return (
    <div className="flex min-h-screen">
        <AdminSidebar />
        <AdminContent>
            {children}
        </AdminContent>
    </div>
  );
}


// O export default envolve tudo com o Provider
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AlarmProvider>
      <AdminLayoutController>
        {children}
      </AdminLayoutController>
    </AlarmProvider>
  );
}
