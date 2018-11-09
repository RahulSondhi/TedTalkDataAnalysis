import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.model_selection import train_test_split
from sklearn.decomposition import PCA
import csv
import sys

if (len(sys.argv) != 3):
    print("Usage: script [arg Xaxis] [arg Yaxis] ")
    exit()
else:
    with open('../data/ted_main.csv') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        line_count = 0
        Xaxis = 0
        Yaxis = 0
        data = []
        for row in csv_reader:
            if line_count == 0:
                
                if(sys.argv[1] in row):
                    Xaxis = row.index(sys.argv[1])
                else:
                    print("Usage: script [arg Xaxis] [arg Yaxis] \n")
                    print("Possible Tags:")
                    print(row)
                    exit()
                
                if(sys.argv[2] in row):
                    Yaxis = row.index(sys.argv[2])
                else:
                    print("Usage: script [arg Xaxis] [arg Yaxis] \n")
                    print("Possible Tags:")
                    print(row)
                    exit()
                line_count += 1
            
            else:
                x = [float(row[Xaxis]),float(row[Yaxis])]
                data.append(x)
                line_count += 1
        data = np.array(data)
        df=pd.DataFrame({''+sys.argv[1]+'':data[:,0] , ''+sys.argv[2]+'':data[:,1]})

        train, test = train_test_split(df, test_size=0.04, random_state=0)
        
        test = test.reset_index().values
        
        kmeans = KMeans(n_clusters=3)
        kmeans.fit(test)

        print(test)
        plt.scatter(test[:,1], test[:,2], c=kmeans.labels_, cmap='rainbow')
        
        # label the x and y axes
        plt.xlabel(''+sys.argv[1]+'', weight='bold', size='large')
        plt.ylabel(''+sys.argv[2]+'', weight='bold', size='large')
        
        #saving kmeans pic
        plt.savefig('kmeans.png')
        
        ####################################################################
        plt.clf()
        pca = PCA(.95)
        pca.fit(test)
        U, S, V = np.linalg.svd(test)
        eigvals = S**2 / np.cumsum(S)[-1]
        plt.figure(figsize=(8,5))
        sing_vals = np.arange(3) + 1
        plt.plot(sing_vals, eigvals, 'ro-', linewidth=2)

        # label the x and y axes
        plt.xlabel(''+sys.argv[1]+'', weight='bold', size='large')
        plt.ylabel(''+sys.argv[2]+'', weight='bold', size='large')

        plt.savefig('pca.png')


