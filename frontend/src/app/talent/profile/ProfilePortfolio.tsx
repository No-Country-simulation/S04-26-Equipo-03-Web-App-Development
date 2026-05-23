interface ProfilePortfolioProps {
  portfolioUrl: string | null;
}

const ProfilePortfolio = ({ portfolioUrl }: ProfilePortfolioProps) => {
  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Portfolio</h2>
      { portfolioUrl ? (
        <a
          href={ portfolioUrl }
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[#4f46e5] font-medium break-all hover:underline"
        >
          { portfolioUrl }
        </a>
      ) : (
        <p className="text-sm text-gray-500">
          Aún no agregaste un portfolio.{ ' ' }
          <a href="#" className="text-[#4f46e5] font-medium">
            + Agregar enlace
          </a>
        </p>
      ) }
    </div>
  );
};

export default ProfilePortfolio;
