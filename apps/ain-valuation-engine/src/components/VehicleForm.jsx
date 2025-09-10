import React, { useState } from "react";

const VehicleForm = () => {
  // ... other state hooks
  const [titleStatus, setTitleStatus] = useState("");

  // ... other form logic

  return (
    <form>
      {/* ...other form fields... */}

      <label htmlFor="titleStatus">Title Status</label>
      <select
        id="titleStatus"
        value={titleStatus}
        onChange={e => setTitleStatus(e.target.value)}
        required
      >
        <option value="" disabled>
          Select Title Status
        </option>
        <option value="clean">Clean</option>
        <option value="salvage">Salvage</option>
        <option value="rebuilt">Rebuilt</option>
        <option value="flood">Flood</option>
        <option value="lemon">Lemon</option>
        <option value="manufacturer_buyback">Manufacturer Buyback</option>
      </select>

      {/* ...other form fields... */}

      <button type="submit" disabled={!titleStatus}>
        Next
      </button>
    </form>
  );
};

export default VehicleForm;