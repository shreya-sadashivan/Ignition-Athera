import time
import machine
from machine import UART, Pin
import ubinascii
import json
import socket
import network
import math

# ----------------- CONFIG -----------------
WIFI_SSID = "OnePlus Nord CE 3 Lite 5G"
WIFI_PASS = "Hot$pot!23"

# simple HTTP POST endpoint (server that accepts telemetry JSON)
# e.g. SERVER_HOST='example.com', SERVER_PORT=80, SERVER_PATH='/api/telemetry'
SERVER_HOST = "http://localhost:8080"
SERVER_PORT = 80
SERVER_PATH = "/api/telemetry"