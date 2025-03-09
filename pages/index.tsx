import BaseLayout from '@/components/layouts/BaseLayout';
import { Hero, ImagePlaceholder } from '@/components/pages/home';
import { FaWallet, FaCoins, FaCubes, FaExchangeAlt, FaHammer } from 'react-icons/fa';

const Home = () => {
 

  return (
    <BaseLayout>
      <div className="flex flex-col md:flex-row lg:gap-56 justify-between">
        {/* Left Column - Main Content */}
        <div className="flex-1">
          <Hero />
        </div>
        
        {/* Right Column - Minting Card */}
        <div className="md:w-96 lg:w-96 flex-shrink-0 mt-16 md:mt-0">
          <ImagePlaceholder />
        </div>
      </div>
    </BaseLayout>
  );
};

export default Home;