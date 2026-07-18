import { Key } from 'lucide-react';


export default function GhostcodeToken() {
  return (
    <>
      <section className="py-32 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <Key className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-6 text-foreground">GhostCode Token</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Hardware-based authentication token for maximum security. Two-factor authentication that cannot be intercepted or duplicated.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { title: 'Hardware Security', desc: 'Physical token ensures authentication cannot be compromised remotely.' },
            { title: 'Universal Compatibility', desc: 'Works with all major platforms and authentication standards.' },
            { title: 'Tamper-Proof', desc: 'Built with anti-tamper technology to prevent physical manipulation.' },
          ].map((item, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold mb-2 text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
