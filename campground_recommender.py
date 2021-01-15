import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from apyori import apriori


def inspect(results):
    lhs         = [tuple(result[2][0][0])[0] for result in results]
    rhs         = [tuple(result[2][0][1])[0] for result in results]
    supports    = [result[1] for result in results]
    confidences = [result[2][0][2] for result in results]
    lifts       = [result[2][0][3] for result in results]
    return list(zip(lhs, rhs, supports, confidences, lifts))


dataset = pd.read_csv('campground_places.csv', header = None)
transactions = []
for i in range(0, 7501):
  transactions.append([str(dataset.values[i,j]) for j in range(0, 20)])




rules = apriori(transactions = transactions, min_support = 0.001, min_confidence = 0.1, min_lift = 2, min_length = 2, max_length = 2)

results = list(rules)

resultsinDataFrame = pd.DataFrame(inspect(results), columns = ['Left Hand Side', 'Right Hand Side', 'Support', 'Confidence', 'Lift'])

res = []
res.append(list(resultsinDataFrame.nlargest(n=5,columns='Lift').values[i] for i in range(4)))

ans=[]
for i in range(len(res[0])):
  ans.append(res[0][i][0])
  ans.append(res[0][i][1])


print(list(set(ans)),flush=True)




