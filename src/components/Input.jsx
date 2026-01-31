const Input = ({ type, placeholder, label, value, onChange, error, name }) => {
  return (
    <div className="w-full">
      <label className="text-sm font-semibold">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value || ''}
        onChange={onChange}
        name={name}
        className="mt-1 block w-full px-3 py-2 bg-[#F1F4F9] border border-[#D8D8D8] rounded-md shadow-sm placeholder-[#A6A6A6] focus:outline-none focus:ring-[#4880FF] focus:border-[#4880FF] sm:text-sm"
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default Input;
