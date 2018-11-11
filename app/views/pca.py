import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

import csv
import sys
import imp

def pcaEm(url):

    df = pd.read_csv(url)

    features = ["inspiring", "informative", "funny", "views", "comments", "languages", "duration", "published_date", "confusing", "unconvincing"]

    # Separating out the features
    x = df.loc[:, features].values
    # Separating out the target
    y = df.loc[:,['title']].values
    # Standardizing the features
    x = StandardScaler().fit_transform(x)

    pca = PCA(n_components=2)
    principalComponents = pca.fit_transform(x)
    principalDf = pd.DataFrame(data = principalComponents, columns = ['principal component 1', 'principal component 2'])

    finalDf = pd.concat([principalDf, df[['title']]], axis = 1)

    fig = plt.figure(figsize = (8,8))

    plt.savefig('../static/python/pca.png')
