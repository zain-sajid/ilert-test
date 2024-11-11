import Image from 'next/image';
import Logo from '@/public/logo.svg';

export default function Navbar() {
  return (
    <nav className="bg-[#043460]">
      <Image src={Logo} alt="ilert Logo" width={90} className='p-2' />
    </nav>
  );
}
