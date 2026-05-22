import { Skeleton } from '@/components/ui/skeleton';

const ProfilePortfolio = () => {
  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Portfolio</h2>
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton
            key={i}
            className="aspect-square bg-gray-300 flex items-center justify-center"
          >
            {i + 1}
          </Skeleton>
        ))}
      </div>
    </div>
  );
};

export default ProfilePortfolio;
