import qrcode
import time

def makeQr(message):
  currTime = time.time()
  img = qrcode.make(f"{message},{currTime}")
  img.save(f'static/{currTime}.png')
  return f'{currTime}.png' 
