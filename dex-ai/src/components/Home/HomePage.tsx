import Banner from '../Home/Banner';
import Cards from '../Home/Cards';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Banner />
      <div className="flex gap-5 mt-6">
        <Cards />
      </div>
    </div>
  );
}
