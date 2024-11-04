export default function Button ({name,click}) {
    return(
        <button className="px-5 py-2 m-2 rounded-md w-full text-white bg-blue-600 hover:text-blue-600 hover:bg-white" onClick={click}>{name}</button>
    )
}