from machine import UART, Pin
import time

class NEOM8N_GPS:
    def __init__(self, uart_id=0, tx_pin=0, rx_pin=1, baudrate=9600):
        """
        Initialize GPS module
        uart_id: UART port (0 or 1)
        tx_pin: TX pin number
        rx_pin: RX pin number
        """
        self.uart = UART(uart_id, baudrate=baudrate, tx=Pin(tx_pin), rx=Pin(rx_pin))
        self.latitude = None
        self.longitude = None
        self.altitude = None
        self.timestamp = None
        self.satellites = 0
        self.fix_quality = 0
        self.path_points = []
        
    def convert_to_degrees(self, raw_value, direction):
        """Convert NMEA format to decimal degrees"""
        if not raw_value:
            return None
        
        # NMEA format: DDMM.MMMM or DDDMM.MMMM
        if direction in ['N', 'S']:
            degrees = int(raw_value[:2])
            minutes = float(raw_value[2:])
        else:  # E, W
            degrees = int(raw_value[:3])
            minutes = float(raw_value[3:])
        
        decimal = degrees + (minutes / 60.0)
        
        if direction in ['S', 'W']:
            decimal = -decimal
            
        return round(decimal, 6)
    
    def parse_gga(self, sentence):
        """Parse GGA sentence for position and altitude"""
        try:
            parts = sentence.split(',')
            if len(parts) < 15:
                return False
            
            # Time
            if parts[1]:
                time_str = parts[1]
                hours = time_str[0:2]
                minutes = time_str[2:4]
                seconds = time_str[4:6]
                self.timestamp = f"{hours}:{minutes}:{seconds}"
            
            # Latitude
            if parts[2] and parts[3]:
                self.latitude = self.convert_to_degrees(parts[2], parts[3])
            
            # Longitude
            if parts[4] and parts[5]:
                self.longitude = self.convert_to_degrees(parts[4], parts[5])
            
            # Fix quality
            self.fix_quality = int(parts[6]) if parts[6] else 0
            
            # Satellites
            self.satellites = int(parts[7]) if parts[7] else 0
            
            # Altitude
            if parts[9]:
                self.altitude = float(parts[9])
            
            return True
        except:
            return False
    
    def parse_rmc(self, sentence):
        """Parse RMC sentence for speed and date"""
        try:
            parts = sentence.split(',')
            if len(parts) < 10:
                return False
            
            # Date
            if parts[9]:
                date_str = parts[9]
                day = date_str[0:2]
                month = date_str[2:4]
                year = date_str[4:6]
                self.date = f"20{year}-{month}-{day}"
            
            return True
        except:
            return False
    
    def read_gps(self):
        """Read and parse GPS data"""
        if self.uart.any():
            try:
                line = self.uart.readline()
                if line:
                    sentence = line.decode('ascii', errors='ignore').strip()
                    
                    # Check for valid NMEA sentence
                    if sentence.startswith('$'):
                        if 'GGA' in sentence:
                            self.parse_gga(sentence)
                        elif 'RMC' in sentence:
                            self.parse_rmc(sentence)
                        
                        return True
            except:
                pass
        return False
    
    def get_position(self):
        """Get current position data"""
        return {
            'latitude': self.latitude,
            'longitude': self.longitude,
            'altitude': self.altitude,
            'timestamp': self.timestamp,
            'satellites': self.satellites,
            'fix_quality': self.fix_quality
        }
    
    def record_path_point(self):
        """Record current position to path"""
        if self.latitude and self.longitude and self.fix_quality > 0:
            point = {
                'lat': self.latitude,
                'lon': self.longitude,
                'alt': self.altitude,
                'time': self.timestamp
            }
            self.path_points.append(point)
            return True
        return False
    
    def get_path(self):
        """Get recorded path points"""
        return self.path_points
    
    def clear_path(self):
        """Clear recorded path"""
        self.path_points = []
    
    def has_fix(self):
        """Check if GPS has valid fix"""
        return self.fix_quality > 0 and self.satellites >= 3


# Main program
def main():
    # Initialize GPS on UART0 (TX=GP0, RX=GP1)
    # Adjust pins according to your wiring
    gps = NEOM8N_GPS(uart_id=0, tx_pin=0, rx_pin=1, baudrate=9600)
    
    print("U-blox NEO-M8N GPS Reader")
    print("Waiting for GPS fix...")
    print("-" * 50)
    
    path_record_interval = 5  # Record path point every 5 seconds
    last_record_time = 0
    
    while True:
        # Read GPS data
        gps.read_gps()
        
        # Display current position every second
        pos = gps.get_position()
        
        print(f"\rSats: {pos['satellites']} | Fix: {pos['fix_quality']} | ", end='')
        
        if gps.has_fix():
            print(f"Lat: {pos['latitude']:.6f} | Lon: {pos['longitude']:.6f} | ", end='')
            print(f"Alt: {pos['altitude']:.1f}m | Time: {pos['timestamp']}", end='')
            
            # Record path point at intervals
            current_time = time.time()
            if current_time - last_record_time >= path_record_interval:
                if gps.record_path_point():
                    print(f" | Points: {len(gps.get_path())}", end='')
                last_record_time = current_time
        else:
            print("Waiting for fix...", end='')
        
        time.sleep(1)


# Alternative: Simple polling example
def simple_example():
    gps = NEOM8N_GPS(uart_id=0, tx_pin=0, rx_pin=1)
    
    while True:
        gps.read_gps()
        
        if gps.has_fix():
            pos = gps.get_position()
            print(f"Position: {pos['latitude']}, {pos['longitude']}")
            print(f"Altitude: {pos['altitude']}m")
            print(f"Time: {pos['timestamp']}")
            print(f"Satellites: {pos['satellites']}")
            print("-" * 40)
            
            # Record to path
            gps.record_path_point()
            
            time.sleep(5)
        else:
            print("Searching for satellites...")
            time.sleep(1)


if __name__ == "__main__":
    main()
    # Or use: simple_example()