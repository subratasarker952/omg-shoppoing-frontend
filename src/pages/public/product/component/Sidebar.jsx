const Sidebar = ({ categories, sizes, onFilterChange }) => {
    return (
        <aside className="w-64 p-4 border-r hidden md:block">
            <h2 className="font-bold text-lg mb-4">Filters</h2>

            {/* Category Filter */}
            <div className="mb-6">
                <h3 className="font-semibold mb-2">Category</h3>
                {categories.map(cat => (
                    <div key={cat} className="flex items-center mb-1">
                        <input
                            type="checkbox"
                            onChange={(e) => onFilterChange('category', e.target.checked ? cat : '')}
                            className="mr-2"
                        />
                        <label className="capitalize">{cat}</label>
                    </div>
                ))}
            </div>

            {/* Size Filter */}
            <div className="mb-6">
                <h3 className="font-semibold mb-2">Size</h3>
                <div className="flex flex-wrap gap-2">
                    {sizes.map(size => (
                        <button
                            key={size}
                            onClick={() => onFilterChange('size', size)}
                            className="border px-3 py-1 hover:bg-black hover:text-white transition"
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar