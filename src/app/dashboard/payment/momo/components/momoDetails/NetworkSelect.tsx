"use client";

import React from "react";

interface NetworkSelectProps {
  selectedNetwork: string;
  handleNetworkChange: (network: string) => void;
}

const NetworkSelect: React.FC<NetworkSelectProps> = ({
  selectedNetwork,
  handleNetworkChange,
}) => {
  const networks = ["MTN", "TELECEL", "AIRTELTIGO"];

  return (
    <div>
      <label
        htmlFor="network"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Select Network
      </label>
      <select
        id="network"
        name="network"
        value={selectedNetwork}
        onChange={(e) => handleNetworkChange(e.target.value)}
        className="mt-1 cursor-pointer block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-lg border"
      >
        {networks.map((network, index) => (
          <option key={index} value={network}>
            {network}
          </option>
        ))}
      </select>
    </div>
  );
};

export default NetworkSelect;
