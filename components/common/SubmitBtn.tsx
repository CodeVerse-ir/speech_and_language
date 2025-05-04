"use client";

interface SubmitBtnProps {
  title: string;
  style: string;
  isPending: boolean;
}

const SubmitBtn: React.FC<SubmitBtnProps> = ({ title, style, isPending }) => {
  return (
    <button
      type="submit"
      disabled={isPending}
      className={`${style} flex items-center justify-center outline focus-visible:outline-rose-600`}
    >
      {!isPending ? (
        title
      ) : (
        <div className="flex items-center justify-center gap-x-2">
          <div>منتظر بمانید</div>
          <div className="flex items-center justify-center w-9 h-2 gap-x-1 child:size-2 child:rounded-full child:bg-white">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      )}
    </button>
  );
};

export default SubmitBtn;
