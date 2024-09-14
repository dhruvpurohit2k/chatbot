import json
import torch
from model import NeuralNet
from nltk_utils import bag_of_words,tokenize

with open('intents2.json','r') as f:
  intents = json.load(f)

FILE = 'data.pth'
data = torch.load(FILE,weights_only=True)

input_size = data["input_size"]
output_size = data["output_size"]
hidden_size = data["hidden_size"]
all_words = data["all_words"]
tags = data["tags"]
model_state = data["model_state"]


model = NeuralNet(input_size,hidden_size,output_size)
model.load_state_dict(model_state)
model.eval()

bot_name = "Sam"


def get_response(message):
  message = tokenize(message)

  x = bag_of_words(message,all_words)
  x = x.reshape(1,x.shape[0])
  x = torch.from_numpy(x)

  output = model(x)
  _, predicted = torch.max(output,dim=1)
  tag = tags[predicted.item()]

  probs = torch.softmax(output,dim=1)
  prob = probs[0][predicted.item()]
  if prob.item() > 0.75:
    print(prob.item())
    for intent in intents["intents"]:
      print(tag,intent['tag'])
      if tag == intent['tag']:
        return   tag
  else :

        return "ERROR"

print(get_response('3 children tickets please'))