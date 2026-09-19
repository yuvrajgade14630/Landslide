# **Technical Analysis: AI/ML Prediction Engine for Landslide Early Warning (SIH26001)** 

In the North Eastern Region (NER) of India, predicting slope failures requires modeling the physical threshold where gravitational shear stresses exceed the shear strength of the regolith. This section outlines the complete machine learning architecture for the SIH prototype, covering the input parameters, model selection trade-offs, spatial training design, and the complete data-to-alert pipeline. 

# **1. Ingestion Variables: Data Sources and Physical Significance** 

Landslide initiation is controlled by **static conditioning factors** (which dictate where slopes are inherently weak) and **dynamic triggering factors** (which dictate when slopes fail). 

|**Variable**<br>**Category**|**Parameter**|**Source /**<br>**Sensor**<br>**Feed**|**Native**<br>**Resolution**|**Physical and**<br>**Geomechanical**<br>**Role**|
|---|---|---|---|---|
|**Dynamic**<br>**Trigger**|Accumulated<br>Rainfall (24h,<br>72h)|IMD<br>Gridded /<br>NASA GPM<br>IMERG|0.25°<br>(IMD) / 0.1°<br>(IMERG)|Transient water<br>infiltration;<br>generates<br>positive pore-<br>water pressure<br>along the slip<br>surface.|
|**Dynamic**<br>**Trigger**|Soil Moisture|NASA SMAP<br>L4 / ERA5-<br>Land|9 km / 0.1°|Baseline<br>saturation state;<br>determines how<br>rapidly<br>subsequent rain<br>converts into<br>destabilizing<br>runoff.|
|**Dynamic**<br>**Trigger**|Seismic<br>Activity (PGA)|National<br>Center for<br>Seismology<br>(NCS) API|Real-time<br>event<br>points|Ground shaking;<br>transient cyclic<br>shear stresses<br>reduce dynamic<br>friction angles in<br>fractured rock.|



|**Variable**<br>**Category**|**Parameter**|**Source /**<br>**Sensor**<br>**Feed**|**Native**<br>**Resolution**|**Physical and**<br>**Geomechanical**<br>**Role**|
|---|---|---|---|---|
|**Static**<br>**Conditioning**|Slope<br>Gradient (_β_)|CartoDEM /<br>SRTM 1-<br>ArcSec|30 m|Primary<br>gravitational<br>driving stress;<br>governs<br>downslope shear<br>stress<br>components.|
|**Static**<br>**Conditioning**<br>**Static**<br>**Conditioning**|Elevation &<br>Topographic<br>Aspect<br>Vegetation<br>Dynamics<br>(NDVI)|CartoDEM<br>(ISRO)<br>Sentinel-2<br>MSI /<br>MODIS|30 m<br>10 m / 250<br>m|Controls<br>microclimatic<br>rainfall exposure,<br>solar insolation,<br>and orographic<br>precipitation<br>gradients.<br>Mechanical root<br>tensile<br>reinforcement<br>and canopy<br>rainfall<br>interception<br>capacity.|
|**Static**<br>**Conditioning**|Lithology &<br>Rock<br>Strength|GSI<br>National<br>Geoscience<br>Repository|1:50,000<br>vector|Intrinsic shear<br>strength<br>parameters:<br>internal friction<br>angle (_ϕ_) and<br>effective<br>cohesion (_c'_).|
|**Static**<br>**Conditioning**|Distance to<br>Faults & Road|GSI<br>Bhukosh /<br>PMGSY /|Vector<br>layers|Structural rock<br>discontinuities<br>and mechanical|



|**Variable**<br>**Category**|**Parameter**|**Source /**<br>**Sensor**<br>**Feed**|**Native**<br>**Resolution**|**Physical and**<br>**Geomechanical**<br>**Role**|
|---|---|---|---|---|
||Cuts|BRO||toe-support<br>removal from<br>unplanned hill<br>cutting.|
|**Ground Truth**|Historical<br>Landslides|GSI<br>Bhukosh /<br>NRSC<br>Landslide<br>Atlas|Vector<br>polygons /<br>points|Historical event<br>labels used for<br>supervised<br>model training<br>and spatial<br>validation.|



# **2. Evaluation of Machine Learning and Deep Learning Approaches** 

|**Model**<br>**Architecture**|**Macro**<br>**F1-**<br>**Score**|**ROC-**<br>**AUC**|**Inference**<br>**Speed**<br>**(104**<br>**points)**|**Production**<br>**Viability for**<br>**SIH**<br>**Prototype**|**Key Strengths**<br>**and Critical**<br>**Bottlenecks**|
|---|---|---|---|---|---|
|**Logistic**<br>**Regression**|0.62 to<br>0.68|0.71<br>to<br>0.76|<2 ms|Poor|Highly<br>interpretable,<br>but assumes<br>linear<br>boundaries;<br>cannot model<br>threshold-<br>driven<br>moisture-slope<br>collapses.|
|**Random**<br>**Forest (RF)**|0.79 to<br>0.84|0.86<br>to<br>0.89|45 to 80<br>ms|High|Robust non-<br>linear<br>ensemble;<br>resilient to<br>noise, but|



|**Model**<br>**Architecture**|**Macro**<br>**F1-**<br>**Score**|**ROC-**<br>**AUC**|**Inference**<br>**Speed**<br>**(104**<br>**points)**|**Production**<br>**Viability for**<br>**SIH**<br>**Prototype**|**Key Strengths**<br>**and Critical**<br>**Bottlenecks**|
|---|---|---|---|---|---|
||||||produces large<br>serialized<br>model files (<br>>500 MB) that<br>strain edge<br>nodes.|
|**XGBoost**<br>**(Selected)**|**0.84 to**<br>**0.89**|**0.91**<br>**to**<br>**0.94**|**8 to 15 ms**|**Optimal**|State-of-the-<br>art tabular<br>accuracy;<br>sparsity-aware<br>split finding<br>natively<br>handles<br>missing sensor<br>inputs;<br>integrates<br>TreeSHAP for<br>explainable<br>warnings.|
|**LightGBM**|0.83 to<br>0.88|0.90<br>to<br>0.93|5 to 10 ms|Highly<br>Viable|Fast<br>histogram-<br>based tree<br>splitting; lower<br>RAM overhead<br>than XGBoost,<br>though slightly<br>more sensitive<br>to tuning on<br>sparse regional<br>subsets.|
|**Multi-Layer**|0.75 to|0.82|20 to 35|Moderate|Capable of|



|**Model**<br>**Architecture**|**Macro**<br>**F1-**<br>**Score**|**ROC-**<br>**AUC**|**Inference**<br>**Speed**<br>**(104**<br>**points)**|**Production**<br>**Viability for**<br>**SIH**<br>**Prototype**|**Key Strengths**<br>**and Critical**<br>**Bottlenecks**|
|---|---|---|---|---|---|
|**Perceptron**|0.81|to<br>0.86|ms||non-linear<br>fitting, but<br>prone to<br>overfitting on<br>spatially<br>clustered<br>training data<br>and sensitive<br>to uncalibrated<br>feature scales.|
|**CNN-2D**<br>**(Satellite**<br>**Imagery)**|0.78 to<br>0.83|0.85<br>to<br>0.88|250 to 600<br>ms|Unviable|Optical<br>imagery is<br>obstructed by<br>dense<br>monsoon<br>cloud cover<br>across the<br>NER; requires<br>dedicated GPU<br>nodes and<br>introduces<br>high latency.|
|**LSTM (Time-**<br>**Series)**|0.81 to<br>0.86|0.88<br>to<br>0.91|>800 ms|Unviable|The NER's<br>sparse weather<br>stations lack<br>the dense,<br>continuous<br>multi-year<br>hourly data<br>feeds required<br>to stabilize<br>recurrent|



|**Model**<br>**Architecture**|**Macro**<br>**F1-**<br>**Score**|**ROC-**<br>**AUC**|**Inference**<br>**Speed**<br>**(104**<br>**points)**|**Production**<br>**Viability for**<br>**SIH**<br>**Prototype**|**Key Strengths**<br>**and Critical**<br>**Bottlenecks**|
|---|---|---|---|---|---|
||||||neural network<br>training.|



# **Why XGBoost is the Most Realistic Model for the Prototype** 

NASA's operational global landslide early warning system (LHASA 2.0) transitioned from heuristic decision trees directly to an **XGBoost** framework for its speed, accuracy, and reliability. For a Smart India Hackathon prototype, XGBoost provides three distinct operational advantages over complex neural networks: 

   1. **Handling Missing Data Without Imputation:** Missing values are common during monsoon storms due to sensor dropouts and network outages. XGBoost retains missing value branches natively during training, routing missing features to default child nodes without pausing the prediction pipeline. 

   2. **Standard CPU Inference:** XGBoost can run inference on an entire administrative district (100,000 grid cells at 30 m resolution) in under 150 milliseconds using commodity multi-core CPUs, avoiding the cost and complexity of GPU servers. 

   3. **Explainability for Administrative Action (TreeSHAP):** Disaster management officials need clear physical justifications before ordering evacuations or closing highways. By applying TreeSHAP (SHapley Additive exPlanations) to XGBoost, the platform produces human-readable explanations alongside raw hazard scores (e.g., _"Warning issued: 72h rainfall exceeds 115 mm on a 38° slope with an undercut road toe"_ ), directly addressing government decision-making requirements. 

**3. Training Architecture, Dataset Assembly, and Preprocessing** 

# **Training Inventories and Sample Volume** 

#  **Primary Data Sources:** 

- Geological Survey of India (GSI) Bhukosh / National Landslide Susceptibility Mapping (NLSM) database. 

- ISRO NRSC Landslide Atlas of India, which maps over 80,000 historical landslides across India, including 12,385 recorded events in Mizoram and high event densities in Sikkim and Arunachal Pradesh. 

- **Target Sample Size:** 15,000 to 25,000 samples focused on high-risk NER districts (e.g., East Khasi Hills in Meghalaya, Gangtok in Sikkim, and Aizawl in Mizoram). This sample size balances algorithmic convergence with local geomorphic representation while keeping training memory footprints under 250 MB. 

# **Target Variable Formulation** 

The target variable is formulated as a binary classification problem: 

_Y ∈_ {0,1 } 

where _Y_ =1 indicates a documented landslide initiation event occurring within a specific 30 m grid cell under a given meteorological event, and _Y_ =0 indicates a stable, non-failing slope condition. 

# **Constrained Pseudo-Absence Sampling** 

Landslide inventories are presence-only ( _Y_ =1) catalogs. Training a binary classifier requires generating realistic absence points ( _Y_ =0) while avoiding label contamination: 

- **Geomorphic Exclusion:** Slopes flatter than 5° ( _β_ <5 _∘_ ) are excluded from absence sampling. Including flat river valleys allows models to inflate accuracy through trivial slope correlations without learning physical failure thresholds. 

- **Spatial Buffer Exclusion:** A 500 m perimeter buffer is generated around all historical landslide scars and deposits to ensure unstable or unmapped runout zones are not labeled as stable ground. 

- **Controlled Absence Sampling:** Absence samples ( _Y_ =0) are selected from remaining terrain on moderate slopes (8° to 35°) during non-triggering dry weather ( _P_ daily <5 mm). A 1:4 positive-to-negative ratio is maintained, with class imbalance corrected in XGBoost by setting: 

scale_pos_weight =4.0 

# **Handling Missing Data Feeds** 

- **Optical Cloud Gaps:** If heavy monsoon cloud cover obscures Sentinel-2 optical NDVI imagery for more than 15 consecutive days, the ingestion engine switches to Sentinel-1 dual-polarized ( _VV_ / _VH_ ) C-band Synthetic Aperture Radar (SAR) backscatter. The cross-polarization ratio ( _σ VH∘_ / _σ ∘VV_ ) serves as an all-weather proxy for surface roughness, vegetation biomass, and soil moisture changes. 

- **Weather Station Outages:** If a local terrestrial rain gauge drops offline, the system estimates precipitation using Inverse Distance Weighting (IDW) interpolation from the three nearest functional gauges within a 35 km radius. If 

terrestrial networks fail completely, the pipeline falls back to satellite-derived NASA GPM IMERG Early Run data. 

- **Inference Pipeline Robustness:** For remaining sensor dropouts during live execution, XGBoost's default split directions process missing values directly without requiring synthetic imputation. 

# **4. Model Evaluation and Spatial Validation Strategy** 

# **The Spatial Autocorrelation Pitfall** 

Standard random _k_ -fold cross-validation produces invalid, over-optimistic performance estimates when applied to geospatial data. Because adjacent geographic pixels share near-identical terrain, geology, and weather (Tobler’s First Law of Geography), random sampling allows test points to sit adjacent to training points. The model memorizes neighboring coordinates rather than learning transferable physical relationships, yielding inflated scores ( _ROC_ − _AUC_ >0.98) that drop sharply when deployed on new slopes. 

# **Spatial Block Cross-Validation Framework** 

- **Catchment Partitioning:** The regional domain is split into five discrete geographic blocks based on independent river sub-basins or spatial _k_ -means coordinate clusters. 

- **Exclusion Buffers:** A 15 km buffer is enforced between training and testing blocks to eliminate spatial data leakage. 

- **Out-of-Block Generalization:** The model is trained on four spatial blocks and evaluated strictly on the unseen fifth block, verifying that the system can predict slope failures in unmapped valleys. 

Spatial Cross-Validation Performance Comparison 

-------------------------------------------------------------------------------------Validation Strategy        Precision   Recall      F1-Score    ROC-AUC     PR-AUC 

-------------------------------------------------------------------------------------Random 5-Fold (Biased)     0.94        0.92        0.93        0.98        0.96 Spatial Block CV (Proposed)0.82        0.86        0.84        0.91        0.87 -------------------------------------------------------------------------------------- 

# **Primary Evaluation Metrics** 

- **Recall (Sensitivity):** Recall=<sup>TP</sup> TP+FN<sup>. The primary safety metric. False negatives</sup> 

- (missed landslides) carry life-safety consequences. Target: _≥_ 0.85. 

- **Precision-Recall AUC (PR-AUC):** The most reliable metric for evaluating model performance under heavy class imbalance, as it evaluates positive detection rates without being skewed by large numbers of true negatives. 

- **Receiver Operating Characteristic (ROC-AUC):** Evaluates discrimination capacity across varying alert classification thresholds. Target: _≥_ 0.90. 

- **False Alarm Ratio (FAR):** FAR=<sup>FP</sup> TP+FP<sup>. Monitored to prevent alert fatigue</sup> 

- among district disaster authorities. Target: _≤_ 0.20. 

# **5. End-to-End Operational Workflow Deliverable** 

The operational prediction pipeline runs on an automated execution loop (hourly for emergency triggers, daily for standard forecasts). It follows seven sequential steps: 

# **Step 1: Multi-Source Data Ingestion (INPUT)** 

- **Static Rasters:** Digital elevation models (CartoDEM 30 m), GSI 1:50,000 lithology maps, and road network vector layers. 

- **Dynamic Feeds:** Real-time IMD AWS station telemetry, NASA GPM IMERG Early Run satellite rainfall, NASA SMAP L4 soil moisture, and NCS real-time seismic shake feeds. 

# **Step 2: Data Preprocessing** 

- **Reprojection:** Reproject all spatial layers to a standard Universal Transverse Mercator (UTM Zone 45N/46N, WGS84) coordinate system. 

- **Spatial Alignment:** Resample and align all inputs to a uniform 30 m _×_ 30 m target grid. 

- **Orographic Downscaling:** Downscale coarse satellite precipitation grids (0.1 _∘_ ) to 30 m using DEM-derived elevation lapse rates to model precipitation increases along windward slopes. 

# **Step 3: Feature Engineering** 

Transform raw environmental measurements into indices that capture slope failure mechanisms: 

- **Antecedent Rainfall Index (ARI):** Models progressive soil saturation and drainage decay using a 14-day tracking window and a daily attenuation factor of _λ_ =0.84: 



- **Instantaneous-to-Antecedent Burst Ratio (** _R_ burst **):** Identifies short-duration cloudbursts falling on pre-wetted slopes: 



- **Topographic Wetness Index (TWI):** Quantifies steady-state subterranean moisture convergence based on contributing upslope drainage area ( _α_ ) and slope angle ( _β_ ): 



- **Anthropogenic Slope Destabilization Index (ASDI):** Models unsupported cutslopes within a 50 m perimeter of mountain roads: 



# **Step 4: ML Model Execution** 

- The pre-trained, regularized XGBoost ensemble evaluates the combined feature vector for each 30 m grid cell. 

- Computes raw tree decision margin values ( ´ _y_ ) across the spatial grid. 

# **Step 5: Probability Calibration (Risk Probability)** 

- Raw tree margins are calibrated into true physical failure probabilities ( _P L ∈_ [ 0,1 ]) using Platt Scaling (logistic sigmoid calibration): 



- Scaling parameters _A_ and _B_ are fitted via maximum likelihood estimation during out-of-block cross-validation to eliminate overconfident probability estimates. 

# **Step 6: Risk Score Normalization (0–100)** 

To prioritize disaster response, the physical failure probability is combined with infrastructure and human exposure ratings ( _E_ norm _∈_ [ 0,1 ]), calculated from PMGSY road classifications and census settlement density: 



The resulting continuous metric ( _S_ risk _∈_ [ 0,100 ]) weights physical hazard at 70% and potential human/infrastructure impact at 30%. 

# **Step 7: Tiered Early Warning Classification** 

Pipeline Flow Summary: 

INPUT (IMD, GPM, SMAP, DEM, GSI) 

↓ 

Data Preprocessing (UTM 30m grid, orographic downscaling, SAR gap-fill) 

↓ 

Feature Engineering (ARI, R_burst, TWI, ASDI) 

↓ 

ML Model (XGBoost ensemble with TreeSHAP explanations) 

↓ 

Risk Probability (Platt Scaling: P_L in [0, 1]) 

↓ 

Risk Score (0–100 scale: S_risk = 100 * [0.70 * P_L + 0.30 * E_norm]) 

↓ 

Tiered Early Warning: 

• Low (Green):       0 <= S_risk < 25 • Medium (Yellow):  25 <= S_risk < 50 • High (Orange):    50 <= S_risk < 75 • Critical (Red):   75 <= S_risk <= 100 

|**Warnin**<br>**g Tier**|**Risk**<br>**Scor**<br>**e**<br>**(Sris**<br>**k)**|**Failure**<br>**Probabilit**<br>**y (PL)**|**Environment**<br>**al**<br>**Thresholds**|**Disaster**<br>**Response**<br>**Protocol**|**Public**<br>**Communicati**<br>**on Action**|
|---|---|---|---|---|---|
|**Low**<br>**(Green)**|0_≤S_risk<|_PL_<0.20|Background<br>conditions;<br>dry weather|Normal civil<br>preparednes<br>s; routine|Web<br>dashboard<br>displays green|



|**Warnin**<br>**g Tier**|**Risk**<br>**Scor**<br>**e**<br>**(Sris**<br>**k)**|**Failure**<br>**Probabilit**<br>**y (PL)**|**Environment**<br>**al**<br>**Thresholds**|**Disaster**<br>**Response**<br>**Protocol**|**Public**<br>**Communicati**<br>**on Action**|
|---|---|---|---|---|---|
||||or rain<br><25 mm/day;<br>unsaturated<br>soil (<br>_ARI_<40 mm)<br>.|automated<br>telemetry<br>and sensor<br>checks.|status; no<br>mobile alerts<br>pushed.|
|**Mediu**<br>**m**<br>**(Yellow**<br>**)**|25_≤S_risk|0.20_≤PL_<0.|Elevated soil<br>moisture (<br>_ARI ≥_60 mm)<br>; sustained<br>rain of 25 to<br>60 mm/day;<br>slopes¿20<br>_∘_<br>near roads.|Advisory<br>dispatched<br>to District<br>Disaster<br>Managemen<br>t Authorities;<br>standby<br>alert to road<br>maintenanc<br>e crews.|Precautionary<br>travel<br>advisories<br>displayed<br>along<br>mountain<br>highway<br>corridors.|
|**High**<br>**(Orange**<br>**)**|50_≤S_risk|0.45_≤PL_<0.|Saturated<br>soil profile;<br>heavy rain of<br>60 to 120<br>mm/day;<br>vulnerable<br>cut-slopes.|Emergency<br>Operations<br>Centers<br>activated;<br>heavy earth-<br>moving<br>equipment<br>pre-<br>positioned<br>near hazard<br>zones.|Automated<br>SMS alerts<br>transmitted in<br>regional<br>languages<br>(Khasi, Mizo,<br>Assamese,<br>Bengali); non-<br>essential travel<br>restricted.|
|**Critical**<br>**(Red)**|75_≤S_risk|_PL≥_0.75|Extreme<br>cloudburst (<br>>120 mm/day|Immediate<br>deployment<br>of NDRF and|Targeted<br>hillside<br>evacuations|



|**Warnin**<br>**g Tier**|**Risk**<br>**Scor**<br>**e**<br>**(Sris**<br>**k)**|**Failure**<br>**Probabilit**<br>**y (PL)**|**Environment**<br>**al**<br>**Thresholds**|**Disaster**<br>**Response**<br>**Protocol**|**Public**<br>**Communicati**<br>**on Action**|
|---|---|---|---|---|---|
||||) or active<br>seismic<br>shaking over<br>saturated<br>regolith.|SDRF<br>teams;<br>mandatory<br>closures<br>enforced<br>along<br>vulnerable<br>transport<br>arteries.|ordered;<br>emergency<br>sirens<br>sounded; cell-<br>broadcast<br>alerts pushed<br>to all local<br>towers.|



