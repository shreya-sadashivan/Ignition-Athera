from machine import Pin, I2C, UART
import time
import math

class MPU6050:
    def __init__(self, i2c, addr=0x68):
        self.i2c = i2c
        self.addr = addr
        
        # Wake up the MPU-6050
        self.i2c.writeto_mem(self.addr, 0x6B, b'\x00')
        time.sleep_ms(100)
        
        # Verify connection
        try:
            whoami = self.i2c.readfrom_mem(self.addr, 0x75, 1)[0]
            print(f"MPU6050 WHO_AM_I: {hex(whoami)}")
        except Exception as e:
            print(f"MPU6050 init error: {e}")
    
    def read_raw_data(self, reg):
        """Read raw 16-bit data from sensor"""
        high = self.i2c.readfrom_mem(self.addr, reg, 1)[0]
        low = self.i2c.readfrom_mem(self.addr, reg + 1, 1)[0]
        value = (high << 8) | low
        
        if value > 32768:
            value -= 65536
        return value
    
    def get_accel_data(self):
        """Get accelerometer data in g"""
        accel_x = self.read_raw_data(0x3B) / 16384.0
        accel_y = self.read_raw_data(0x3D) / 16384.0
        accel_z = self.read_raw_data(0x3F) / 16384.0
        return {'x': accel_x, 'y': accel_y, 'z': accel_z}
    
    def get_gyro_data(self):
        """Get gyroscope data in degrees/second"""
        gyro_x = self.read_raw_data(0x43) / 131.0
        gyro_y = self.read_raw_data(0x45) / 131.0
        gyro_z = self.read_raw_data(0x47) / 131.0
        return {'x': gyro_x, 'y': gyro_y, 'z': gyro_z}
    
    def get_temp(self):
        """Get temperature in Celsius"""
        temp_raw = self.read_raw_data(0x41)
        temp_c = (temp_raw / 340.0) + 36.53
        return temp_c
    
    def get_acceleration_magnitude(self):
        """Calculate total acceleration magnitude"""
        accel = self.get_accel_data()
        magnitude = math.sqrt(accel['x']**2 + accel['y']**2 + accel['z']**2)
        return magnitude


class NEOM8N_GPS:
    def __init__(self, uart_id=0, tx_pin=0, rx_pin=1, baudrate=9600):
        self.uart = UART(uart_id, baudrate=baudrate, tx=Pin(tx_pin), rx=Pin(rx_pin))
        self.latitude = None
        self.longitude = None
        self.altitude = None
        self.timestamp = None
        self.date = None
        self.satellites = 0
        self.fix_quality = 0
        self.speed = 0.0  # Speed in km/h
        
    def convert_to_degrees(self, raw_value, direction):
        """Convert NMEA format to decimal degrees"""
        if not raw_value:
            return None
        
        if direction in ['N', 'S']:
            degrees = int(raw_value[:2])
            minutes = float(raw_value[2:])
        else:
            degrees = int(raw_value[:3])
            minutes = float(raw_value[3:])
        
        decimal = degrees + (minutes / 60.0)
        
        if direction in ['S', 'W']:
            decimal = -decimal
            
        return round(decimal, 6)
    
    def parse_gga(self, sentence):
        """Parse GGA sentence"""
        try:
            parts = sentence.split(',')
            if len(parts) < 15:
                return False
            
            if parts[1]:
                time_str = parts[1]
                hours = time_str[0:2]
                minutes = time_str[2:4]
                seconds = time_str[4:6]
                self.timestamp = f"{hours}:{minutes}:{seconds}"
            
            if parts[2] and parts[3]:
                self.latitude = self.convert_to_degrees(parts[2], parts[3])
            
            if parts[4] and parts[5]:
                self.longitude = self.convert_to_degrees(parts[4], parts[5])
            
            self.fix_quality = int(parts[6]) if parts[6] else 0
            self.satellites = int(parts[7]) if parts[7] else 0
            
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
            
            # Speed in knots, convert to km/h
            if parts[7]:
                self.speed = float(parts[7]) * 1.852
            
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
                    
                    if sentence.startswith('$'):
                        if 'GGA' in sentence:
                            self.parse_gga(sentence)
                        elif 'RMC' in sentence:
                            self.parse_rmc(sentence)
                        return True
            except:
                pass
        return False
    
    def has_fix(self):
        """Check if GPS has valid fix"""
        return self.fix_quality > 0 and self.satellites >= 3


class ActivityClassifier:
    """Classifies rider activity: IDLE, WALKING, or RIDING"""
    
    def __init__(self, window_size=10):
        self.window_size = window_size
        self.accel_history = []
        self.gyro_history = []
        self.speed_history = []
        
    def add_sample(self, accel, gyro, speed):
        """Add sensor sample to history"""
        # Calculate acceleration magnitude (remove gravity)
        accel_mag = math.sqrt(accel['x']**2 + accel['y']**2 + accel['z']**2)
        accel_variance = abs(accel_mag - 1.0)  # Variance from 1g (gravity)
        
        # Calculate gyroscope magnitude
        gyro_mag = math.sqrt(gyro['x']**2 + gyro['y']**2 + gyro['z']**2)
        
        # Add to history
        self.accel_history.append(accel_variance)
        self.gyro_history.append(gyro_mag)
        self.speed_history.append(speed)
        
        # Keep only recent samples
        if len(self.accel_history) > self.window_size:
            self.accel_history.pop(0)
            self.gyro_history.pop(0)
            self.speed_history.pop(0)
    
    def get_average(self, data_list):
        """Calculate average of list"""
        if not data_list:
            return 0
        return sum(data_list) / len(data_list)
    
    def get_variance(self, data_list):
        """Calculate variance of list"""
        if len(data_list) < 2:
            return 0
        avg = self.get_average(data_list)
        variance = sum((x - avg) ** 2 for x in data_list) / len(data_list)
        return variance
    
    def classify(self):
        """
        Classify activity based on sensor data:
        - IDLE: No movement, low speed, minimal acceleration
        - WALKING: Low speed (2-6 km/h), rhythmic acceleration pattern
        - RIDING: Higher speed (>6 km/h), continuous motion
        """
        if len(self.accel_history) < 3:
            return "INITIALIZING"
        
        # Calculate metrics
        avg_speed = self.get_average(self.speed_history)
        avg_accel_var = self.get_average(self.accel_history)
        avg_gyro = self.get_average(self.gyro_history)
        accel_variance = self.get_variance(self.accel_history)
        
        # Classification logic
        
        # IDLE: Very low speed and minimal movement
        if avg_speed < 1.0 and avg_accel_var < 0.15 and avg_gyro < 10:
            return "IDLE"
        
        # WALKING: Low speed with rhythmic movement pattern
        # Walking has characteristic periodic acceleration (footsteps)
        elif avg_speed >= 1.0 and avg_speed < 8.0:
            # Walking typically has more variance in acceleration due to steps
            if accel_variance > 0.01 and avg_accel_var > 0.1:
                return "WALKING"
            elif avg_speed < 6.0:
                return "WALKING"
        
        # RIDING: Higher sustained speed with smoother motion
        if avg_speed >= 8.0:
            return "RIDING"
        
        # Edge cases - use acceleration patterns
        if avg_accel_var > 0.2 or avg_gyro > 30:
            if avg_speed > 6.0:
                return "RIDING"
            else:
                return "WALKING"
        
        # Default to idle if uncertain
        return "IDLE"
    
    def get_confidence(self):
        """Get confidence level of classification (0-100%)"""
        if len(self.accel_history) < self.window_size:
            return int((len(self.accel_history) / self.window_size) * 100)
        return 100


class RideTracker:
    def __init__(self, gps, mpu):
        self.gps = gps
        self.mpu = mpu
        self.classifier = ActivityClassifier(window_size=10)
        self.path_points = []
        self.total_distance = 0.0
        self.last_lat = None
        self.last_lon = None
        self.activity_stats = {
            'IDLE': 0,
            'WALKING': 0,
            'RIDING': 0
        }
        
    def calculate_distance(self, lat1, lon1, lat2, lon2):
        """Calculate distance between two GPS points using Haversine formula (in meters)"""
        R = 6371000  # Earth's radius in meters
        
        phi1 = math.radians(lat1)
        phi2 = math.radians(lat2)
        delta_phi = math.radians(lat2 - lat1)
        delta_lambda = math.radians(lon2 - lon1)
        
        a = math.sin(delta_phi/2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda/2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        
        return R * c
    
    def update_classifier(self):
        """Update activity classifier with current sensor data"""
        accel = self.mpu.get_accel_data()
        gyro = self.mpu.get_gyro_data()
        speed = self.gps.speed if self.gps.has_fix() else 0.0
        
        self.classifier.add_sample(accel, gyro, speed)
        
        return self.classifier.classify()
    
    def record_point(self):
        """Record current position with sensor data and activity"""
        if self.gps.has_fix():
            accel = self.mpu.get_accel_data()
            gyro = self.mpu.get_gyro_data()
            activity = self.classifier.classify()
            confidence = self.classifier.get_confidence()
            
            # Update activity statistics
            self.activity_stats[activity] = self.activity_stats.get(activity, 0) + 1
            
            # Calculate distance from last point
            if self.last_lat and self.last_lon:
                distance = self.calculate_distance(
                    self.last_lat, self.last_lon,
                    self.gps.latitude, self.gps.longitude
                )
                self.total_distance += distance
            
            point = {
                'lat': self.gps.latitude,
                'lon': self.gps.longitude,
                'alt': self.gps.altitude,
                'time': self.gps.timestamp,
                'date': self.gps.date,
                'speed': self.gps.speed,
                'accel_x': accel['x'],
                'accel_y': accel['y'],
                'accel_z': accel['z'],
                'gyro_x': gyro['x'],
                'gyro_y': gyro['y'],
                'gyro_z': gyro['z'],
                'distance': self.total_distance,
                'activity': activity,
                'confidence': confidence
            }
            
            self.path_points.append(point)
            self.last_lat = self.gps.latitude
            self.last_lon = self.gps.longitude
            
            return True
        return False
    
    def get_stats(self):
        """Get ride statistics"""
        if not self.path_points:
            return None
        
        max_speed = max(p['speed'] for p in self.path_points)
        avg_speed = sum(p['speed'] for p in self.path_points) / len(self.path_points)
        
        # Calculate time in each activity
        total_points = len(self.path_points)
        activity_percentages = {
            activity: (count / total_points * 100) if total_points > 0 else 0
            for activity, count in self.activity_stats.items()
        }
        
        return {
            'points': len(self.path_points),
            'distance_km': self.total_distance / 1000,
            'max_speed': max_speed,
            'avg_speed': avg_speed,
            'activity_breakdown': activity_percentages,
            'current_activity': self.classifier.classify()
        }
    
    def export_path_gpx(self, filename="ride_track.gpx"):
        """Export path to GPX format with activity data"""
        try:
            with open(filename, 'w') as f:
                f.write('<?xml version="1.0"?>\n')
                f.write('<gpx version="1.1">\n')
                f.write('  <trk>\n')
                f.write('    <name>Ride Track with Activity</name>\n')
                f.write('    <trkseg>\n')
                
                for point in self.path_points:
                    f.write(f'      <trkpt lat="{point["lat"]}" lon="{point["lon"]}">\n')
                    f.write(f'        <ele>{point["alt"]}</ele>\n')
                    f.write(f'        <time>{point["date"]}T{point["time"]}Z</time>\n')
                    f.write(f'        <extensions>\n')
                    f.write(f'          <activity>{point["activity"]}</activity>\n')
                    f.write(f'          <speed>{point["speed"]:.2f}</speed>\n')
                    f.write(f'        </extensions>\n')
                    f.write(f'      </trkpt>\n')
                
                f.write('    </trkseg>\n')
                f.write('  </trk>\n')
                f.write('</gpx>\n')
            
            print(f"Track exported to {filename}")
            return True
        except Exception as e:
            print(f"Export error: {e}")
            return False


def main():
    print("=" * 60)
    print("GPS + MPU6050 Activity Tracking Ride Tracker")
    print("=" * 60)
    
    # Initialize I2C for MPU6050 (GP16=SDA, GP17=SCL)
    print("\n[1/3] Initializing MPU6050...")
    i2c = I2C(0, scl=Pin(17), sda=Pin(16), freq=400000)
    devices = i2c.scan()
    print(f"I2C devices found: {[hex(d) for d in devices]}")
    mpu = MPU6050(i2c)
    
    # Initialize GPS (GP0=TX, GP1=RX)
    print("\n[2/3] Initializing GPS...")
    gps = NEOM8N_GPS(uart_id=0, tx_pin=0, rx_pin=1, baudrate=9600)
    
    # Initialize tracker
    print("\n[3/3] Starting tracker...")
    tracker = RideTracker(gps, mpu)
    
    print("\nWaiting for GPS fix...")
    print("Activities: IDLE | WALKING | RIDING")
    print("-" * 60)
    
    last_record_time = 0
    record_interval = 2  # Record every 2 seconds
    
    while True:
        # Read GPS data
        gps.read_gps()
        
        # Update activity classification
        current_activity = tracker.update_classifier()
        confidence = tracker.classifier.get_confidence()
        
        # Get current sensor data for display
        accel = mpu.get_accel_data()
        gyro = mpu.get_gyro_data()
        
        # Display status with activity
        print(f"\r[GPS] Sats:{gps.satellites} Fix:{gps.fix_quality} ", end='')
        
        if gps.has_fix():
            print(f"| Lat:{gps.latitude:.5f} Lon:{gps.longitude:.5f} ", end='')
            print(f"Speed:{gps.speed:.1f}km/h ", end='')
            
            # Show activity with visual indicator
            activity_icons = {
                'IDLE': '⏸️ ',
                'WALKING': '🚶',
                'RIDING': '🚴',
                'INITIALIZING': '⏳'
            }
            icon = activity_icons.get(current_activity, '❓')
            print(f"| Activity: {icon} {current_activity} ({confidence}%) ", end='')
            
            # Record point at intervals
            current_time = time.time()
            if current_time - last_record_time >= record_interval:
                if tracker.record_point():
                    stats = tracker.get_stats()
                    print(f"| Pts:{stats['points']} Dist:{stats['distance_km']:.2f}km", end='')
                last_record_time = current_time
        else:
            print("| Waiting for GPS fix... ", end='')
            # Still classify activity even without GPS
            print(f"| Activity: {current_activity} ({confidence}%)", end='')
        
        time.sleep(0.3)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n" + "=" * 60)
        print("Ride tracking stopped!")
        print("=" * 60)