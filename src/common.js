/**
 * Common JS for Web Tools Collection
 * Handles Theme, Toasts, and Shared UI logic
 */



// Toast Notification System
export function showToast(title, message = '', type = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'fixed bottom-12 md:bottom-16 left-1/2 -translate-x-1/2 z-[3000] pointer-events-none space-y-2';
        document.body.appendChild(container);
    }

    if (container.children.length > 2) container.children[0].remove();
    
    const toast = document.createElement('div');
    const bgClass = type === 'success' 
        ? 'bg-slate-900/90 dark:bg-slate-800/90 border border-slate-800 dark:border-slate-700' 
        : 'bg-rose-600/90';
    const icon = type === 'success' ? 'ri-checkbox-circle-fill' : 'ri-error-warning-fill';
    
    toast.className = `flex items-center gap-3 px-6 py-3 rounded-2xl shadow-xl backdrop-blur-xl text-white transform transition-all duration-300 translate-y-10 opacity-0 ${bgClass}`;
    toast.innerHTML = `
        <i class="${icon} text-lg opacity-80"></i>
        <div class="flex flex-col">
            <span class="font-bold text-[10px] truncate tracking-widest uppercase">${title}</span>
            ${message ? `<span class="text-[9px] opacity-60 font-medium">${message}</span>` : ''}
        </div>
    `;
    
    container.appendChild(toast);
    setTimeout(() => toast.classList.remove('translate-y-10', 'opacity-0'), 10);
    setTimeout(() => {
        toast.classList.add('translate-y-10', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}


