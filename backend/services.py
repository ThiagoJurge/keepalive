import socket
import time
import subprocess
import requests
import re


def ping(host):
    """
    Faz ping no host e retorna uma tupla:
    (True/False indicando sucesso, tempo de resposta em segundos ou None)
    """
    try:
        result = subprocess.run(
            ["ping", "-c", "1", host], capture_output=True, text=True, timeout=3
        )

        if result.returncode == 0:
            # Exemplo: "64 bytes from 8.8.8.8: icmp_seq=1 ttl=117 time=12.3 ms"
            match = re.search(r"time[=<]?\s*(\d+(?:\.\d+)?)\s*ms", result.stdout)
            if match:
                return True, float(match.group(1)) / 1000
            return True, None
        return False, None
    except:
        return False, None


def check_port(host, port):
    try:
        with socket.create_connection((host, port), timeout=3):
            return True
    except:
        return False


def check_http(url):
    try:
        start = time.time()
        response = requests.get(url, timeout=5)
        end = time.time()
        return True, round(end - start, 3)  # sempre retorna True se houve resposta
    except requests.RequestException:
        return False, None
