import Image from 'next/image';
import Logo from '@/public/logo.svg';
import TeamSelector from '@/components/team-selector';

export default function Navbar() {
  return (
    <nav className="bg-[#043460] flex justify-between">
      <Image src={Logo} alt="ilert Logo" width={90} className="p-2" />
      <TeamSelector />
    </nav>
  );
}
