import { Loader2 } from 'lucide-react';

interface LoadingProps {
  fullScreen?: boolean;
  message?: string;
}

export const Loading = ({ fullScreen = true, message = 'Loading...' }: LoadingProps) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center gap-3">
          <Loader2 size={40} className="text-primary-500 animate-spin" />
          <p className="text-secondary-700 font-medium">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <Loader2 size={24} className="text-primary-500 animate-spin" />
      <p className="text-secondary-700">{message}</p>
    </div>
  );
};

export default Loading;
