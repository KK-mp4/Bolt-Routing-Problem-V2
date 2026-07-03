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
[Greedy t-spanner](#5-greedy-t-spanner)
[Yao-8 graph](#6-yao-8-graph)
[Proximity graphs](#7-proximity-graphs)
[Hub backbone](#8-hub-backbone)
[Solver properties](#solver-properties)
[Distance matrix heatmap](#distance-matrix-heatmap)
[Pareto front](#pareto-front)
[Future work](#future-work)
[How to use](#how-to-use)

## Problem Domain

Generalizing and looking outside the Minecraft, this problem comes down to finding an optimal interconnect for a given set of vertices (stations) on a 2 dimensional [Chebyshev metric space](https://en.wikipedia.org/wiki/Chebyshev_distance).
The solution to the problem is a weighted directed/undirected graph. Weight will be Chebyshev distance between vertices (stations) and directionality would come down to the fact that the graph has loops or not. For example, [Hamiltonian path] can be directed, since in theory a player can get to any station from any station just by traveling in one direction.

Originally this was a two-objective problem: minimize total piston bolt length and minimize average travel time. In practice those globally optimized solutions have a hidden flaw: they are not future-proof. Because they optimize over the whole point set at once, adding a single new station can reshuffle the entire network and force a full rebuild. That raises a third criterion:

3. **Local stability (incremental insertion)** - can a new station be attached by only touching its neighborhood, leaving the rest of the network untouched, instead of triggering a global rebuild?

So the design space is now a trade-off between three properties: tunnel length, average travel time, and local stability. The [solver properties](#solver-properties) tags below summarize where each algorithm sits on these three axes.

### 1. Star graph

[Star graph](<https://en.wikipedia.org/wiki/Star_(graph_theory)>) is a type of [tree graph](<https://en.wikipedia.org/wiki/Tree_(graph_theory)>) with one internal node and _k_ leaves. You can place the internal node at any arbitrary location, but there is one provably optimal spot.

The naive picks fail because they optimize the wrong metric: the average (centroid) minimizes the sum of squared Euclidean distances, and the coordinatewise median minimizes the sum of Manhattan distances. Since piston bolts travel in Chebyshev distance, neither is correct. The trick is that Chebyshev distance equals Manhattan distance under the 45° rotation `u = x + z`, `v = x - z` (`Chebyshev = ½(|Δu| + |Δv|)`), and the Manhattan 1-median is separable. So the optimal center (the **Chebyshev geometric median**) is `u* = median(x + z)`, `v* = median(x − z)`, transformed back to `x = (u* + v*) / 2`, `z = (u* − v*) / 2` and snapped to the nearest integer lattice point. This point minimizes total ray length, and because every path in a star routes through the center it also minimizes the star's average travel time.

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

[Hamiltonian path](https://en.wikipedia.org/wiki/Hamiltonian_path) is a [loop graph](<https://en.wikipedia.org/wiki/Loop_(graph_theory)>) that visits each vertex exactly once.

![image](https://github.com/KK-mp4/Bolt-Routing-Problem-V2/assets/103208695/7c97f92b-a88b-47ed-9342-f0928d02de15)

### 3.3. Prim's algorithm

[Prim's algorithm](https://en.wikipedia.org/wiki/Prim%27s_algorithm) is a greedy algorithm that finds a minimum spanning tree for a weighted undirected graph.

![image](https://github.com/KK-mp4/Bolt-Routing-Problem-V2/assets/103208695/21d6c402-c115-49cc-ac9d-d47fac18cc70)

### 3.4 Kruskal's algorithm

[Kruskal's algorithm](https://en.wikipedia.org/wiki/Kruskal%27s_algorithm) finds MST of an undirected edge-weighted graph.

![image](https://github.com/KK-mp4/Bolt-Routing-Problem-V2/assets/103208695/33d08fa8-5d3b-4b28-8ec1-64ad3c8a6939)

### 4. Steiner tree

[Steiner tree problem](https://en.wikipedia.org/wiki/Steiner_tree_problem) consists of finding the minimum tree that includes specific points and, if necessary, uses a number
of auxiliary points to minimize the tree length (unlike MST). This problem is NP-hard, however [heuristic solution](<https://www.textroad.com/pdf/JBASR/J.%20Basic.%20Appl.%20Sci.%20Res.,%203(1s)611-613,%202013.pdf>) exists.

Since piston bolts move in 8 directions (a diagonal step is free), edge length here is the Chebyshev distance, not the Euclidean one. This makes it a Chebyshev (octilinear) variant of the Steiner tree problem rather than the classical Euclidean one. Chebyshev distance equals Manhattan distance under a 45° rotation (`u = x + z`, `v = x - z`), so the solver uses the [Iterated 1-Steiner](https://en.wikipedia.org/wiki/Steiner_tree_problem#Steiner_ratio) heuristic on the rotated (octilinear) [Hanan grid](https://en.wikipedia.org/wiki/Hanan_grid): it repeatedly inserts the candidate junction point that reduces the minimum spanning tree cost the most, then prunes junctions that end up with degree less than 3.

Note that the complete graph and the Steiner tree are the two hard endpoints of the [Pareto front](https://en.wikipedia.org/wiki/Pareto_front): the complete graph gives the theoretical minimum average travel time (every pair has a direct edge, which is the shortest possible path in a metric space), and the Steiner tree gives the theoretical minimum total length. Every algorithm below fills the space in between.

### 5. Greedy t-spanner

A [geometric t-spanner](https://en.wikipedia.org/wiki/Geometric_spanner) guarantees that for every pair of stations the shortest in-network path is at most `t` times their direct Chebyshev distance, while using far fewer edges than the complete graph. It is built greedily: consider all pairs shortest-first and add an edge only when the current graph cannot already route that pair within the allowed stretch. The stretch factor `t` sweeps the Pareto front, from near the complete graph (`t → 1`) towards the MST (large `t`).

### 6. Yao-8 graph

The [Yao graph](https://en.wikipedia.org/wiki/Yao_graph) splits the plane around each station into 8 cones of 45°, each centered on one of the eight piston-bolt travel directions, and connects the station to its nearest neighbor inside every cone. This produces a sparse, octilinear-friendly spanner that keeps a short hop available in each direction.

### 7. Proximity graphs

Three graphs derived from the [Delaunay triangulation](https://en.wikipedia.org/wiki/Delaunay_triangulation) of the stations:

- **Delaunay** - the full triangulation.
- **[Gabriel graph](https://en.wikipedia.org/wiki/Gabriel_graph)** - keeps an edge only if the disk having that edge as its diameter contains no other station.
- **[Relative neighborhood graph](https://en.wikipedia.org/wiki/Relative_neighborhood_graph)** - keeps an edge only if no station is closer to both endpoints than they are to each other.

Both the Gabriel and relative-neighborhood graphs are subgraphs of the Delaunay triangulation, so they are computed by filtering its edges. Geometry is Euclidean, but every kept edge is still weighted by Chebyshev distance.

### 8. Hub backbone

A future-proof network, available in three styles:

- **Hubs (k-means)** - a small set of hubs is placed with [k-means](https://en.wikipedia.org/wiki/K-means_clustering) over the stations, the hubs are joined into a trunk (an MST over the hubs), and every station spurs to its nearest hub.
- **Fixed grid** - the stations' bounding box is divided into an _n_ × _n_ lattice of trunk lines; every intersection is a junction, adjacent intersections are joined along rows and columns, and each station spurs to its nearest intersection.
- **Nearest neighbors (kNN)** - every station links directly to its _k_ nearest stations by Chebyshev distance, with no hubs or junctions. Since a plain [k-nearest-neighbors graph](https://en.wikipedia.org/wiki/Nearest_neighbor_graph) can leave disconnected pockets, the edges are unioned with an MST over the stations to guarantee the whole network is reachable. Because each station's edges depend only on its neighborhood, inserting a new station later touches just that local area.

The hub and grid styles depend only on their parameters (hub positions or grid divisions), so adding a new station later just attaches one more spur to the nearest existing hub or intersection, leaving the rest of the network untouched, unlike the globally optimized tree solutions that would need a full redesign. The fixed grid is the most future-proof since its trunk does not move at all as long as new stations stay inside the covered area. The kNN style skips the trunk entirely and instead keeps the network locally stable by wiring each station only to its close neighbors.

## Distance matrix heatmap

To calculate average travel time in a given network I use [Floyd-Warshall algorithm](https://en.wikipedia.org/wiki/Floyd%E2%80%93Warshall_algorithm) that generates this matrix of shortest path between any set of points.

![image](https://github.com/KK-mp4/Bolt-Routing-Problem-V2/assets/103208695/d840681b-6312-49e1-83df-7851ac58fd07)

## Pareto front

To choose a network that best suits your needs, there is a page with scatter plot and Pareto front.

![image](https://github.com/KK-mp4/Bolt-Routing-Problem-V2/assets/103208695/ceb521aa-5f25-454d-9c8f-c5dad2ff59ce)

## Future work

Now that local stability is a first-class criterion, the most promising directions are structures that are sparse, keep short routes, and support incremental insertion natively. Candidates worth exploring in this Chebyshev space:

- **HNSW-like navigable graph** - a multi-layer proximity graph in the style of [Hierarchical Navigable Small World](https://en.wikipedia.org/wiki/Hierarchical_navigable_small_world) graphs. It is designed for incremental insertion in any metric space (Chebyshev qualifies), gives roughly _O(log n)_ hops (short routes), and bounds each station's degree. The main drawback is long "express" edges that create tunnel crossings. Microsoft's DiskANN/Vamana is a bounded-degree incremental cousin.
- **Unit-square (fixed-radius) graph** - the Chebyshev analogue of a [unit disk graph](https://en.wikipedia.org/wiki/Unit_disk_graph): connect any two stations within a Chebyshev radius _r_ (an L∞ ball is a square). Naturally local and incremental, but density swings with _r_ and it can disconnect in sparse areas, so it would need an MST fallback like the kNN style.
- **Theta-graph** - a cone-based spanner sibling of the Yao-8 graph that projects onto cone bisectors instead of taking the nearest neighbor per cone. It is a strong spanner and is built per-station, so it is incrementally friendly.
- **Dynamic geometric spanner** - research on [dynamic spanners](https://en.wikipedia.org/wiki/Geometric_spanner) maintains a _t_-spanner under insertions with only polylogarithmic local edge changes, which is the principled way to make the existing greedy t-spanner future-proof instead of rebuilding it from scratch.

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
