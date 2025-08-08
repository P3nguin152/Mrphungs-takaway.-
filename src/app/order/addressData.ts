// Address data for England - Leeds focused

export interface Address {
  id: string;
  street: string;
  city: string;
  postcode: string;
  fullAddress: string;
}

// Focus on Leeds addresses with more variety
export const leedsAddresses: Address[] = [
  // Leeds City Center
  { id: 'leeds1', street: '75 Briggate', city: 'Leeds', postcode: 'LS1 1AB', fullAddress: '75 Briggate, Leeds, LS1 1AB' },
  { id: 'leeds2', street: '120 Park Row', city: 'Leeds', postcode: 'LS1 2CD', fullAddress: '120 Park Row, Leeds, LS1 2CD' },
  { id: 'leeds3', street: '30 Call Lane', city: 'Leeds', postcode: 'LS1 3EF', fullAddress: '30 Call Lane, Leeds, LS1 3EF' },
  { id: 'leeds4', street: '45 The Headrow', city: 'Leeds', postcode: 'LS1 4GH', fullAddress: '45 The Headrow, Leeds, LS1 4GH' },
  { id: 'leeds5', street: '88 Victoria Road', city: 'Leeds', postcode: 'LS1 5IJ', fullAddress: '88 Victoria Road, Leeds, LS1 5IJ' },
  { id: 'leeds6', street: '150 Corporation Street', city: 'Leeds', postcode: 'LS1 6KL', fullAddress: '150 Corporation Street, Leeds, LS1 6KL' },
  { id: 'leeds7', street: '25 New Briggate', city: 'Leeds', postcode: 'LS1 7MN', fullAddress: '25 New Briggate, Leeds, LS1 7MN' },
  { id: 'leeds8', street: '90 East Parade', city: 'Leeds', postcode: 'LS1 8OP', fullAddress: '90 East Parade, Leeds, LS1 8OP' },
  { id: 'leeds9', street: '55 Commercial Street', city: 'Leeds', postcode: 'LS1 9QR', fullAddress: '55 Commercial Street, Leeds, LS1 9QR' },
  { id: 'leeds10', street: '170 Kirkgate', city: 'Leeds', postcode: 'LS2 1ST', fullAddress: '170 Kirkgate, Leeds, LS2 1ST' },
  
  // Leeds Suburbs
  { id: 'leeds11', street: '300 Roundhay Road', city: 'Leeds', postcode: 'LS6 1AB', fullAddress: '300 Roundhay Road, Leeds, LS6 1AB' },
  { id: 'leeds12', street: '150 Headingley Lane', city: 'Leeds', postcode: 'LS6 2CD', fullAddress: '150 Headingley Lane, Leeds, LS6 2CD' },
  { id: 'leeds13', street: '75 Harrogate Road', city: 'Leeds', postcode: 'LS7 3EF', fullAddress: '75 Harrogate Road, Leeds, LS7 3EF' },
  { id: 'leeds14', street: '200 Chapeltown Road', city: 'Leeds', postcode: 'LS7 4GH', fullAddress: '200 Chapeltown Road, Leeds, LS7 4GH' },
  { id: 'leeds15', street: '50 Harehills Avenue', city: 'Leeds', postcode: 'LS8 5IJ', fullAddress: '50 Harehills Avenue, Leeds, LS8 5IJ' },
  { id: 'leeds16', street: '125 Beeston Road', city: 'Leeds', postcode: 'LS11 1KL', fullAddress: '125 Beeston Road, Leeds, LS11 1KL' },
  { id: 'leeds17', street: '80 Holbeck Lane', city: 'Leeds', postcode: 'LS11 2MN', fullAddress: '80 Holbeck Lane, Leeds, LS11 2MN' },
  { id: 'leeds18', street: '160 Meanwood Road', city: 'Leeds', postcode: 'LS6 3OP', fullAddress: '160 Meanwood Road, Leeds, LS6 3OP' },
  { id: 'leeds19', street: '95 Kirkstall Road', city: 'Leeds', postcode: 'LS6 4QR', fullAddress: '95 Kirkstall Road, Leeds, LS6 4QR' },
  { id: 'leeds20', street: '40 Hyde Park Road', city: 'Leeds', postcode: 'LS6 5ST', fullAddress: '40 Hyde Park Road, Leeds, LS6 5ST' },
  
  // More Leeds Postcodes
  { id: 'leeds21', street: '110 Moortown Road', city: 'Leeds', postcode: 'LS17 1AB', fullAddress: '110 Moortown Road, Leeds, LS17 1AB' },
  { id: 'leeds22', street: '65 Alwoodley Lane', city: 'Leeds', postcode: 'LS17 2CD', fullAddress: '65 Alwoodley Lane, Leeds, LS17 2CD' },
  { id: 'leeds23', street: '180 Otley Road', city: 'Leeds', postcode: 'LS16 3EF', fullAddress: '180 Otley Road, Leeds, LS16 3EF' },
  { id: 'leeds24', street: '35 Weetwood Lane', city: 'Leeds', postcode: 'LS16 4GH', fullAddress: '35 Weetwood Lane, Leeds, LS16 4GH' },
  { id: 'leeds25', street: '130 Farsley Lane', city: 'Leeds', postcode: 'LS28 5IJ', fullAddress: '130 Farsley Lane, Leeds, LS28 5IJ' },
];

// Extract unique postcodes from Leeds addresses
export const leedsPostcodes: string[] = [
  ...new Set(leedsAddresses.map(address => address.postcode))
];

// Function to filter addresses based on search term
export const filterAddresses = (searchTerm: string): Address[] => {
  if (!searchTerm) return [];
  
  const term = searchTerm.toLowerCase();
  return leedsAddresses.filter(address => 
    address.fullAddress.toLowerCase().includes(term) ||
    address.street.toLowerCase().includes(term) ||
    address.postcode.toLowerCase().includes(term)
  ).slice(0, 10); // Limit to 10 results
};

// Function to filter postcodes based on search term
export const filterPostcodes = (searchTerm: string): string[] => {
  if (!searchTerm) return [];
  
  const term = searchTerm.toLowerCase();
  return leedsPostcodes.filter(postcode => 
    postcode.toLowerCase().includes(term)
  ).slice(0, 10); // Limit to 10 results
};
