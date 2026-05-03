export const SettingInput = ({ label, name, register, type = "text" }) => (
    <div className="space-y-2">
        <label className="text-xs font-bold text-gray-500 uppercase ml-1">{label}</label>
        <input
            type={type}
            {...register(name)}
            className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium"
        />
    </div>
);