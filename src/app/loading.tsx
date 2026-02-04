export default function Loading() {
    return (
        <div className="fixed inset-0 bg-tech-950 flex flex-col items-center justify-center z-[100]">
            <div className="relative flex flex-col items-center">
                <span className="font-serif text-4xl tracking-[0.3em] text-white animate-pulse">
                    CURIOL<span className="text-curiol-500 font-light ml-2">STUDIO</span>
                </span>
                <div className="mt-8 w-48 h-[1px] bg-tech-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-curiol-500 animate-[loading_1.5s_infinite]" />
                </div>
            </div>
            <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
        </div>
    );
}
