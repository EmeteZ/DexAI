export default function Banner() {
    return (
      <div className="flex relative w-full h-56 overflow-hidden shadow-inner-strong items-center justify-center ">
        <div className="flex bg-black/20 w-full h-fit items-center justify-center ">
        <img
          src="/assets/Images/Charizard.png"        
          className="w-fit h-56 object-cover object-center"
        />
        
        </div>
      </div>
    );
  }