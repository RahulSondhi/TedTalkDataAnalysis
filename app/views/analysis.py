from flask import render_template, request

from app import app

import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt

import csv
import sys
import imp

@app.route("/")
def startEm():
    return render_template("index.html");

@app.route("/pca",methods=['GET'])
def pcaEm():
    csv = str(request.args['data'])
    f = open("app/static/data/temp.csv", "w")
    f.write(csv)
    df = pd.read_csv("app/static/data/temp.csv")

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

    ax = fig.add_subplot(1,1,1)
    ax.set_xlabel('Principal Component 1', fontsize = 15)
    ax.set_ylabel('Principal Component 2', fontsize = 15)
    ax.set_title('2 component PCA', fontsize = 20)

    titles = df['title'];
    for title in titles:
        indicesToKeep = finalDf['title'] == title
        ax.scatter(finalDf.loc[indicesToKeep, 'principal component 1']
                , finalDf.loc[indicesToKeep, 'principal component 2'])
    ax.grid()
    plt.savefig('app/static/python/pca.png')
    return "/static/python/pca.png";
