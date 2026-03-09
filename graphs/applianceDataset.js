// ═══════════════════════════════════════════════
//  APPLIANCE WATT DATASET
//  Reference wattage values for common appliances
// ═══════════════════════════════════════════════
const APPLIANCE_WATT_MAP = {
    'Fan': 70,
    'BLDC Fan': 28,
    'Table Fan': 50,
    'LED Tube': 20,
    'Refrigerator': 150,
    'AC 1 Ton': 900,
    'AC 1.5 Ton': 1300,
    'TV 32': 40,
    'TV 43': 75,
    'Washing Machine': 420,
    'Water Heater': 2000,
    'Induction Stove': 1500,
    'Microwave': 1000,
    'OTG Oven': 1200,
    'Mixer Grinder': 600,
    'WiFi Router': 10
};

// Default usage hours per day for each appliance type
const DEFAULT_HOURS = {
    'Fan': 8,
    'BLDC Fan': 10,
    'Table Fan': 6,
    'LED Tube': 8,
    'Refrigerator': 24,
    'AC 1 Ton': 8,
    'AC 1.5 Ton': 8,
    'TV 32': 5,
    'TV 43': 5,
    'Washing Machine': 1,
    'Water Heater': 1,
    'Induction Stove': 2,
    'Microwave': 0.5,
    'OTG Oven': 1,
    'Mixer Grinder': 0.5,
    'WiFi Router': 24,
    // Defaults for in-scene appliance names
    'Light Bulb 1': 8,
    'Light Bulb 2': 8,
    'Light Bulb': 8,
    'Light': 8,
    'Ceiling Fan': 8,
    'Air Conditioner': 8,
    'AC': 8,
    'Television': 5,
    'Wash Basin Tap': 0.5,
    'Refrigerator': 24,
    'Microwave': 0.5,
    'Induction Stove': 2,
    'Water Purifier': 24,
    'Table Fan': 6,
    'Laptop Charger': 8,
    'Mobile Charger': 12,
    'Water Heater': 1,
    'Mixer Grinder': 0.5,
    'WiFi Router': 24,
    'Charging Port': 6
};
