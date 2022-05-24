import { ConnectButton } from '@rainbow-me/rainbowkit';

const Login = () => {
  return (
    <div className="flex justify-between p-3 ">
      <h1 className='text-3xl'>MultiSig</h1>
      <ConnectButton />
    </div>
  );
};

export default Login;



