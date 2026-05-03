// components/common/Loader.jsx
const Loader = ({ fullScreen = false }) => {
    return (
      <div className={`flex flex-col items-center justify-center ${fullScreen ? 'h-screen w-screen' : 'h-full w-full'}`}>
        {/* মেইন স্পিনার */}
        <div className="relative h-16 w-16">
          <div className="absolute h-16 w-16 rounded-full border-4 border-violet-100 border-t-violet-600 animate-spin"></div>
          {/* মাঝখানে একটি ছোট লোগো বা ডট দিতে পারেন (ঐচ্ছিক) */}
          <div className="absolute top-1/2 left-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-50"></div>
        </div>
        
        {/* নিচের টেক্সট */}
        <p className="mt-4 text-sm font-medium text-gray-500 animate-pulse">
          Please wait, processing...
        </p>
      </div>
    );
  };
  
  export default Loader;