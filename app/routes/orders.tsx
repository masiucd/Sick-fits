export default function Orders() {
  return (
    <div className="col-span-3 border-2 border-gray-900 ">
      <h2 className="mb-5">Your order</h2>
      <div
        className="relative flex justify-between px-2
                py-3 before:absolute before:inset-0 before:z-[-1]  before:border-t-2 before:border-gray-900 before:content-['']
                after:absolute after:inset-0 after:bottom-[0] after:z-[-1]  after:w-full  after:border-b-2 after:border-gray-900 after:content-['']"
      >
        <span className="font-bold">Total:</span> <span>$0.00</span>
      </div>
    </div>
  );
}
