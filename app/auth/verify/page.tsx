export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="glass-card text-center max-w-md w-full mx-4">
        <div className="text-6xl mb-4">📧</div>
        <h1 className="text-2xl font-bold mb-2">Revisá tu email</h1>
        <p className="text-muted-foreground">
          Te enviamos un link mágico para iniciar sesión. 
          Revisá tu bandeja de entrada y spam.
        </p>
      </div>
    </div>
  );
}
