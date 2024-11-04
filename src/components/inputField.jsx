export default function InputField({type, placeholder, value, onChange}) {
    return (
        <input type={type} placeholder={placeholder} value={value} onChange={onChange} className="w-full h-10 p-4 m-2 rounded-md border-2 border-gray-300 focus:outline-none focus:border-blue-600" />
    )
}