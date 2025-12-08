import React from "react";

interface Props {
  onChange: (sortBy: string, order: string) => void;
}

const SortFromBackend: React.FC<Props> = ({ onChange }) => {
  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const [sortBy, order] = e.target.value.split("|");
  onChange(sortBy, order);
};


  return (
    <div className="sort-container">
      <select onChange={handleSort}>
        <option value="">Sort By</option>

        <option value="experience|asc">Experience (Low → High)</option>
        <option value="experience|desc">Experience (High → Low)</option>

      </select>
    </div>
  );
};

export default SortFromBackend;
