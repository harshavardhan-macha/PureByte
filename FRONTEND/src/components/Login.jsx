import { ArrowRight } from "lucide-react";

export default function Login(){
    return(
                      
    <div className="min-h-screen flex items-center justify-center  ">
      <div className="bg-white shadow-lg rounded-xl p-8 w-96" style={{ backgroundColor: 'var(--dash-surface)', color: 'var(--dash-text)' }}>
        <h1 className="text-3xl font-bold mb-6 text-center">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-lg p-3 mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-lg p-3 mb-4"
        />

        <button className="w-full  items-center flex justify-between text-white p-3  px-32 rounded-lg transition" style={{ backgroundColor: 'var(--dash-accent)' }}>
          Login <ArrowRight size={18} className="align-center items-center" />
        </button>
        <div className="relative flex items-center py-2">
        <div className="flex-grow border-t" style={{ borderColor: 'var(--dash-border)' }}></div>
        <span className="flex-shrink mx-4 text-sm font-medium" style={{ color: 'var(--dash-text-muted)' }}>or</span>
        <div className="flex-grow border-t" style={{ borderColor: 'var(--dash-border)' }}></div>
        </div>

  <button type="button" className="flex items-center justify-center gap-3 w-full px-6 py-3.5 text-base font-medium rounded-lg transition-all shadow-sm" style={{ backgroundColor: 'var(--dash-surface)', color: 'var(--dash-text)', border: '1px solid var(--dash-border)' }}>
    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ color: 'var(--dash-accent)' }}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="currentColor"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="currentColor"/>
    </svg>
    <span>Sign in with Google</span></button>
      </div>
    </div>
    
    );
}