# Piston Bolt Network Builder for Minecraft v2 (WIP)
## Online piston bolt network generator and editor

This is an updated web version of an [old](https://github.com/KK-mp4/Bolt-Routing-Problem) project of mine.
With all the new development in [piston bolt tech](https://youtube.com/playlist?list=PLI-RNUGw-AeRkX7MQm9ArljzVCuuSzg0y) old servers might consider rebuilding their piston bolt network in the nether. Thus, a good question arise, what is the right way to do it?

When you already know where the stations will be, it comes down to [multi-objective optimization](https://en.wikipedia.org/wiki/Multi-objective_optimization) problem of how to connect all stations with piston bolts in a way that will minimize both total piston bolt length and the average piston bolt travel time between any set of two stations. This means that the solution lies somewhere on the [Pareto frontier](https://en.wikipedia.org/wiki/Pareto_front).  

![image](https://github.com/KK-mp4/Bolt-Routing-Problem-V2/assets/103208695/5d4a6861-9685-4c5c-8779-b18b9354f728)
<p align="center">
<i>Piston bolt network of Dugged</i>
</p>

## Sections
[Problem domain](#problem-domain)  
[Star graph](#1-star-graph)  
[Complete graph](#2-complete-graph)  
[Minimum spanning tree (MST)](#3-minimum-spanning-tree-mst)  
[Steiner tree](#4-steiner-tree)  
[Distance matrix heatmap](#distance-matrix-heatmap)  
[Pareto front](#pareto-front)  
[How to use](#how-to-use)

## Problem Domain
Generalizing and looking outside the Minecraft, this problem comes down to finding an optimal interconnect for a given set of vertices (stations) on a 2 dimensional [Chebyshev metric space](https://en.wikipedia.org/wiki/Chebyshev_distance).
The solution to the problem is a weighted directed/undirected graph. Weight will be Chebyshev distance between vertices (stations) and directionality would come down to the fact that the graph has loops or not. For example, [Hamiltonian path] can be directed, since in theory a player can get to any station from any station just by traveling in one direction.

### 1. Star graph
[Star graph](https://en.wikipedia.org/wiki/Star_(graph_theory)) is a type of [tree graph](https://en.wikipedia.org/wiki/Tree_(graph_theory)) with one internal node and *k* leaves. You can place the internal node at any arbitrary location, however median or average coordinates of all stations work the best.  

![image](https://github.com/KK-mp4/Bolt-Routing-Problem-V2/assets/103208695/4c2f0657-be05-4619-856a-cfe6bf1a7606)

### 2. Complete graph
[Complete graph](https://en.wikipedia.org/wiki/Complete_graph) is an undirected graph in which every pair of distinct vertices is connected by a unique edge. This gives theoretically shortest amount of average travel time.  

![image](https://github.com/KK-mp4/Bolt-Routing-Problem-V2/assets/103208695/ff3a3217-5e6c-4f72-aab1-ce4dc79c05a6)

### 3. Minimum spanning tree (MST)
[MST](https://en.wikipedia.org/wiki/Minimum_spanning_tree) is a subset of the edges of a connected, weighted undirected graph that connects all the vertices together, without any cycles and with the minimum possible total edge weight.

#### 3.1. Nearest neighbor (NN)
NN is a quick approximation to finding out true MST. The graph this algorithm produces is directed and weighted. Worth mentioning that in the given set of points there are intersections between edges. My implementation is missing one optimization, when detecting line intersections -> switch end points of intersecting lines to get a new, smaller graph.  

![image](https://github.com/KK-mp4/Bolt-Routing-Problem-V2/assets/103208695/1cfd690a-7b1d-48f1-a1e8-f2e492b56e09)

#### 3.2. Hamiltonian cycle
[Hamiltonian path](https://en.wikipedia.org/wiki/Hamiltonian_path) is a [loop graph](https://en.wikipedia.org/wiki/Loop_(graph_theory)) that visits each vertex exactly once.  

![image](https://github.com/KK-mp4/Bolt-Routing-Problem-V2/assets/103208695/7c97f92b-a88b-47ed-9342-f0928d02de15)

### 3.3. Prim's algorithm
[Prim's algorithm](https://en.wikipedia.org/wiki/Prim%27s_algorithm) is a greedy algorithm that finds a minimum spanning tree for a weighted undirected graph.  

![image](https://github.com/KK-mp4/Bolt-Routing-Problem-V2/assets/103208695/21d6c402-c115-49cc-ac9d-d47fac18cc70)

### 3.4 Kruskal's algorithm
[Kruskal's algorithm](https://en.wikipedia.org/wiki/Kruskal%27s_algorithm) finds MST of an undirected edge-weighted graph.  

![image](https://github.com/KK-mp4/Bolt-Routing-Problem-V2/assets/103208695/33d08fa8-5d3b-4b28-8ec1-64ad3c8a6939)

### 4. Steiner tree
[Steiner tree problem](https://en.wikipedia.org/wiki/Steiner_tree_problem) consists of finding the minimum tree that includes specific points and, if necessary, uses a number
of auxiliary points to minimize the tree length (unlike MST). This problem is NP-hard, however [heuristic solution](https://www.textroad.com/pdf/JBASR/J.%20Basic.%20Appl.%20Sci.%20Res.,%203(1s)611-613,%202013.pdf) exists.

## Distance matrix heatmap
To calculate average travel time in a given network I use [Floyd-Warshall algorithm](https://en.wikipedia.org/wiki/Floyd%E2%80%93Warshall_algorithm) that generates this matrix of shortest path between any set of points.  

![image](https://github.com/KK-mp4/Bolt-Routing-Problem-V2/assets/103208695/d840681b-6312-49e1-83df-7851ac58fd07)

## Pareto front
To choose a network that best suits your needs, there is a page with scatter plot and Pareto front.  

![image](https://github.com/KK-mp4/Bolt-Routing-Problem-V2/assets/103208695/ceb521aa-5f25-454d-9c8f-c5dad2ff59ce)

## How to use
This section is work in progress.

Example network JSON:
```json
{
    "stations": [
        {
            "name": "Station A",
            "description": "This is station A",
            "colour": "#f2a788",
            "x": 0,
            "z": 0
        },
        {
            "name": "Station B",
            "description": "This is station B",
            "colour": "#f2a788",
            "x": 10,
            "z": 30
        }
    ],
    "bolts": [
        {
            "directed": false,
            "station_a": {
                "name": "Station A",
                "x": 0,
                "z": 0
            },
            "turn": {
                "x": 10,
                "z": 10
            },
            "station_b": {
                "name": "Station B",
                "x": 10,
                "z": 30
            },
            "length": 30,
            "colour": "#8f7f10"
        }
    ]
}
```

## License
This program is licensed under the MIT License. Please read the License file to know about the usage terms and conditions.
