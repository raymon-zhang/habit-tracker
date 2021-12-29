export default function Loader({ show }) {
    return show ? (
        <div className="border-2 border-gray-200 border-t-blue-600 rounded-[100%] animate-spin w-12 h-12 absolute top-1/2 left-1/2 -m-6"></div>
    ) : null;
}
