const WHATSAPP_NUMBER = '447469131772';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export function WhatsAppFloat() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // '_system' hint makes Capacitor open the OS browser / WhatsApp app
    window.open(WHATSAPP_URL, '_system');
  };

  return (
    <a
      href={WHATSAPP_URL}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      data-whatsapp-float
      className="fixed right-4 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-110 hover:shadow-xl active:scale-95"
      style={{
        bottom: `calc(env(safe-area-inset-bottom, 0px) + 40px)`,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="h-8 w-8"
        fill="#ffffff"
        aria-hidden="true"
      >
        <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.817 0 2.15-.515 2.478-1.318.13-.33.158-.673.158-1.017 0-.575-1.987-1.49-2.622-1.677zM16.205 0C7.42 0 .27 7.15.27 15.935c0 2.68.717 5.348 2.063 7.683L0 32l8.62-2.232a15.84 15.84 0 0 0 7.585 1.92h.014c8.785 0 15.943-7.15 15.943-15.935 0-4.252-1.795-8.246-4.83-11.244C24.305 1.495 20.46 0 16.205 0zm0 29.21h-.013a13.18 13.18 0 0 1-6.752-1.85l-.487-.287-5.014 1.317 1.346-4.913-.315-.502a13.227 13.227 0 0 1-2.034-7.04c0-7.297 5.94-13.236 13.27-13.236a13.106 13.106 0 0 1 9.366 3.882 13.123 13.123 0 0 1 3.868 9.382c0 7.296-5.94 13.236-13.236 13.236z"/>
      </svg>
    </a>
  );
}
