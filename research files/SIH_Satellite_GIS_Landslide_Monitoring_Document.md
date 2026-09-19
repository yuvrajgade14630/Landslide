SMART INDIA HACKATHON | SATELLITE & GIS TECHNOLOGY FOR LANDSLIDE MONITORING 

# **SATELLITE & GIS TECHNOLOGY** 

## **Introduction to Satellite Remote Sensing & GIS** 

### **Satellite Remote Sensing** 

Satellite remote sensing collects information about Earth's surface from sensors carried by satellites. Optical sensors measure reflected solar radiation in several spectral bands, while radar sensors actively transmit microwave energy and measure the returned signal. Because different surfaces respond differently to electromagnetic radiation, satellite measurements can be transformed into maps of vegetation, moisture, surface disturbance, land cover and terrain-related conditions. 

### **Geographic Information System (GIS)** 

GIS provides the spatial framework that allows heterogeneous datasets to be aligned, analysed and visualised. For landslide monitoring, GIS can combine elevation, slope, geology, soil, rainfall, vegetation, satellite deformation, historical landslides, roads, buildings and critical facilities in one coordinate system. 

### **Three levels of landslide intelligence** 

|**Level**|**Mainquestion**|**Typical inputs**|**Output**|
|---|---|---|---|
|Susceptibility|Where is failure more likely?|DEM, slope, geology, soil,<br>land cover,historical events|Susceptibility map|
|Dynamic hazard|Where are current conditions<br>becomingdangerous?|Rainfall, antecedent rainfall,<br>soil moisture,susceptibility|Current hazard level|
|Deformation/change|Is the surface showing<br>measurable change?|Sentinel-1 InSAR,<br>Sentinel-2/Landsat change<br>detection|Monitoring/alert candidates|



### **Why satellite + GIS?** 

- Covers large and inaccessible mountainous regions. 

- Provides repeat observations for time-series analysis. 

- Radar can operate without dependence on daylight and is less affected by cloud cover than optical imaging. 

- Optical imagery provides rich information on vegetation, bare soil and surface disturbance. 

- GIS enables multi-factor analysis instead of isolated observations. 

- Infrastructure exposure can be calculated by intersecting hazard zones with roads, villages, schools, hospitals and bridges. 

### **Recommended system statement** 

The proposed platform estimates landslide susceptibility and evolving hazard by integrating satellite observations, terrain characteristics, rainfall, soil moisture and historical landslide information, while identifying possible pre-failure terrain changes that can be prioritised for field verification. 

Technical Research & System Design 

SMART INDIA HACKATHON | SATELLITE & GIS TECHNOLOGY FOR LANDSLIDE MONITORING 

## **Sentinel-1, SAR and Sentinel-2** 

### **Sentinel-1 SAR** 

Sentinel-1 is a Copernicus radar mission using C-band Synthetic Aperture Radar. Radar actively illuminates the surface, allowing observations during both day and night and under conditions where optical imagery may be obstructed by clouds. This makes Sentinel-1 particularly valuable for monsoon-affected mountainous areas. 

### **Why SAR is important for landslides** 

- Provides repeat observations of the same terrain. 

- Can reveal changes in radar backscatter and coherence. 

- Supports interferometric measurements of surface displacement. 

- Can complement optical imagery when cloud cover is persistent. 

- Is useful for monitoring slopes, infrastructure and persistent deformation. 

### **Sentinel-2 multispectral imagery** 

Sentinel-2 provides multispectral observations across visible, near-infrared and short-wave infrared regions. The data are useful for vegetation health, land-cover mapping, exposed soil, moisture-sensitive indices and landslide scar/change detection. 

|**Dataset**|**Primary role**|**Typical landslide use**|
|---|---|---|
|Sentinel-1|C-band SAR|InSAR deformation, radar change<br>detection,all-weather monitoring|
|Sentinel-2|Multispectral optical|NDVI, land cover, exposed soil,<br>scar/change detection|
|Landsat 8/9|Long historical optical record|Historical land-cover and change<br>baseline|



### **Optical versus radar** 

|**Characteristic**|**Optical imagery**|**SAR**|
|---|---|---|
|Day/night|Mostlydaylight dependent|Dayand night capable|
|Cloud sensitivity|High|Much lower for imaging<br>f|
|Vegetation information|Excellent|Different radar response; interpretation<br>depends on structure/moisture|
|Surface deformation|Indirect|Strongcapabilitywith InSAR|
|Landslide scar mapping|Excellent when cloud-free|Useful through backscatter/coherence<br>change|



Technical Research & System Design 

SMART INDIA HACKATHON | SATELLITE & GIS TECHNOLOGY FOR LANDSLIDE MONITORING 

## **Landsat, DEM and Terrain Analysis** 

### **Landsat as a historical baseline** 

Landsat provides a long-running Earth observation record that can be used to establish historical land-cover conditions and detect long-term environmental change. Landsat 8 and 9 are particularly useful as complementary datasets for historical analysis and cross-checking recent observations. 

### **Digital Elevation Model (DEM)** 

A DEM represents terrain elevation as a raster grid. It is foundational for landslide analysis because terrain geometry controls gravitational loading, drainage pathways and the spatial pattern of slope processes. 

### **Terrain variables** 

|**Variable**|**Meaning**|**Why it matters**|
|---|---|---|
|Elevation|Height above reference surface|Provides terrain context and can<br>correlate with environmentalgradients|
|Slope|Steepness of terrain|One of the most important susceptibility<br>variables<br>l|
|Aspect|Direction a slope faces|Influences solar exposure, vegetation<br>and moisture conditions|
|Curvature|Concavity/convexity|Can indicate convergence/divergence of<br>flow and terrain form|
|Flow accumulation|Upslope contributingarea|Helps identifydrainage concentration|
|Drainage density|Length/density of drainage features|Can represent erosion and water-<br>concentration conditions|



### **Slope** 

Steeper terrain generally has a larger downslope gravitational component, but slope is not a sufficient standalone predictor. A steep slope can remain stable when rock strength, drainage and vegetation are favourable, while a lower-angle slope may fail when weak soil, intense rainfall, road cutting or poor drainage is present. 

### **Terrain-processing workflow** 

DEM → Fill/condition sinks → Derive slope/aspect/curvature → derive drainage/flow accumulation → resample/reproject → GIS feature stack 

### **Recommended DEM sources** 

SRTM is a strong global baseline for prototyping. For India-specific work, Bhuvan/NRSC and CartoDEM resources can be evaluated where their resolution and access are suitable for the target area. 

Technical Research & System Design 

SMART INDIA HACKATHON | SATELLITE & GIS TECHNOLOGY FOR LANDSLIDE MONITORING 

## **NDVI, Soil Moisture and Satellite Change Detection** 

### **NDVI** 

A common vegetation index is: 

#### **NDVI = (NIR − Red) / (NIR + Red)** 

Healthy vegetation usually produces relatively high NDVI. A landslide can remove vegetation and expose soil or rock, causing a detectable spectral change. However, NDVI decline can also result from agriculture, seasonal variation, fire, logging or construction, so it should be combined with other evidence. 

### **Moisture-sensitive information** 

Near-infrared and short-wave infrared bands can support vegetation-moisture and surface-moisture analysis. Satellite soil-moisture products can provide regional wetness context, although their spatial resolution may be too coarse to represent an individual small landslide. 

### **Why soil moisture matters** 

Rainwater infiltration can increase pore-water pressure and reduce effective normal stress. A simplified effective-stress relationship for shear strength is: 

#### **τ = c′ + (σn − u) tan φ′** 

where τ is shear strength, c′ is effective cohesion, σn is normal stress, u is pore-water pressure and φ′ is effective friction angle. Increasing pore pressure can reduce the effective stress available to resist sliding. 

### **Change detection** 

|**Technique**|**Possible signal**|**Main caution**<br>f|
|---|---|---|
|Optical spectral change|Bare soil,vegetation loss,new scar|Clouds and seasonal effects|
|NDVI time series|Vegetation disturbance|Agriculture/seasonality can create false<br>positives|
|SAR backscatter change|Surface/roughness/moisture change|Interpretation depends on scattering<br>conditions|
|SAR coherence change|Surface disturbance|Vegetation and temporal decorrelation|
|Multi-date fusion|Consistent change across sensors|Requires careful temporal alignment|



### **Multi-sensor confirmation** 

A stronger detection strategy is to look for agreement between independent signals—for example, a Sentinel-2 vegetation/surface change together with Sentinel-1 radar change and elevated rainfall. Such agreement can reduce false alarms compared with a single-index approach. 

Technical Research & System Design 

SMART INDIA HACKATHON | SATELLITE & GIS TECHNOLOGY FOR LANDSLIDE MONITORING 

## **SAR, InSAR and Pre-Landslide Deformation** 

### **InSAR concept** 

Interferometric Synthetic Aperture Radar compares the phase information from repeated SAR acquisitions. Changes in phase can be converted, under suitable conditions and processing assumptions, into estimates of surface displacement along the radar line of sight. 

Sentinel-1 acquisition T1 ─┐ 

├→ co-registration → interferogram → filtering → Sentinel-1 acquisition T2 ─┘       phase processing → unwrapping → displacement 

### **What deformation monitoring can identify** 

- Slow-moving slope deformation. 

- Progressive movement over repeated observations. 

- Subsidence or uplift. 

- Movement of infrastructure or exposed terrain. 

- Persistent deformation zones that deserve field inspection. 

### **PSI and SBAS** 

|**Approach**|**Concept**|**Best suited for**|
|---|---|---|
|PSI|Tracks stable radar scatterers through<br>time|Buildings, infrastructure and persistent<br>reflective targets|
|SBAS|Uses suitable small-baseline<br>interferometricpairs|Distributed deformation and broader<br>time-series analysis|



### **Critical limitations** 

- InSAR measures displacement relative to the radar line of sight, not a complete 3D displacement vector. 

- Dense vegetation can reduce radar coherence and make deformation retrieval difficult. 

- Very rapid movement may cause decorrelation. 

- Atmospheric effects can contaminate phase measurements. 

- Steep terrain can create geometric distortions such as layover and shadow. 

- A detected deformation signal is an indicator for investigation, not automatic proof that a catastrophic landslide will occur. 

### **Recommended interpretation** 

The system should classify persistent deformation as a monitoring signal and combine it with susceptibility, rainfall, wetness and field information. This makes the output a risk-prioritisation tool rather than an overconfident deterministic forecast. 

Technical Research & System Design 

SMART INDIA HACKATHON | SATELLITE & GIS TECHNOLOGY FOR LANDSLIDE MONITORING 

## **Rainfall, GPM/IMERG and Dynamic Hazard** 

### **Rainfall as a major trigger** 

Rainfall can trigger landslides by increasing infiltration, saturation and pore-water pressure, while also causing erosion and changes in drainage. For this reason, a landslide system should analyse rainfall over multiple temporal windows instead of using only the current hour. 

### **Recommended rainfall features** 

|**Feature**|**Purpose**|
|---|---|
|1-hour rainfall|Veryshort-duration intensity|
|6-hour rainfall|Short-term accumulation|
|24-hour rainfall|Dailytriggeringload|
|3-dayrainfall|Recent antecedent wetness|
|7-dayrainfall|Multi-dayaccumulation|
|30-dayrainfall|Longer-term wetness context|



### **Antecedent Rainfall Index** 

An exponentially weighted rainfall index can represent the fact that older rainfall may still influence ground wetness, but usually with decreasing importance: 

**ARI = P + kPₜ ₜ ₜ₋₁ + k²Pₜ₋₂ + … + kⁿPₜ₋ₙ** 

Here P represents rainfall and k is a decay factor between zero and one. The decay factor should be calibrated using historical events rather than selected arbitrarily. 

### **GPM / IMERG** 

NASA's Global Precipitation Measurement mission provides precipitation observations, while IMERG combines information from multiple satellite sources into precipitation estimates. Such products are useful for regional monitoring, particularly where ground rain-gauge coverage is sparse. 

### **Rainfall + soil moisture + susceptibility** 

Static susceptibility + 

Recent rainfall / antecedent rainfall + Current wetness / soil moisture ↓ Dynamic landslide hazard estimate 

### **Why this is better than a rainfall-only alert** 

A rainfall threshold treats every location as if it has the same terrain, geology and drainage. A GIS-based system can instead recognise that identical rainfall can produce very different levels of concern on different slopes. This spatial context is a key advantage of multi-source geospatial intelligence. 

Technical Research & System Design 

SMART INDIA HACKATHON | SATELLITE & GIS TECHNOLOGY FOR LANDSLIDE MONITORING 

## **GIS Risk Mapping, AI/ML and Infrastructure Exposure** 

### **GIS data stack** 

|**Category**|**Layers**<br>l|
|---|---|
|Terrain|Elevation, slope, aspect, curvature, drainage, flow<br>accumulation|
|Geology/soil|Geological formation,lithology,soil type,soilproperties|
|Remote sensing|Sentinel-1 deformation, SAR change, Sentinel-2 indices,<br>Landsat history|
|Hydrometeorology|Rainfall,antecedent rainfall,soil moisture|
|History|Historical landslide locations and dates|
|Exposure|Villages, roads, bridges, schools, hospitals, critical<br>infrastructure|



### **Susceptibility model** 

A transparent prototype can use a weighted index: 

#### **LSI = w₁S + w₂R + w₃SM + w₄G + w₅LC + w₆D + w₇H + w₈Def** 

where S is slope, R rainfall, SM soil moisture, G geology, LC land cover, D drainage, H historical landslide information and Def deformation. All inputs should be normalised and the weights calibrated against historical events before operational use. 

### **Machine-learning extension** 

- Random Forest: strong baseline, interpretable feature importance and robust for tabular geospatial features. 

- XGBoost/LightGBM: strong performance on structured environmental features. 

- CNN/U-Net: suitable when the task becomes image classification or pixel-level landslide segmentation. 

- Time-series models: useful when temporal rainfall, deformation and satellite observations are central to the problem. 

### **Infrastructure exposure** 

The most useful output is not simply a red hazard polygon. The system should intersect hazard zones with critical assets and estimate what could be affected. 

- Population/village exposure. 

- Road and railway exposure. 

- Bridge exposure. 

- School and hospital exposure. 

- Emergency-service and shelter exposure. 

- Power and communication infrastructure exposure. 

### **Explainable alert** 

LANDSLIDE RISK ALERT Location: Target slope / district Risk: VERY HIGH Reasons: steep slope + heavy recent rainfall + high antecedent wetness + persistent deformation + historical landslide proximity Exposure: road + bridge + village + critical facility Action: prioritise field verification and emergency preparedness 

Technical Research & System Design 

SMART INDIA HACKATHON | SATELLITE & GIS TECHNOLOGY FOR LANDSLIDE MONITORING 

Technical Research & System Design 

SMART INDIA HACKATHON | SATELLITE & GIS TECHNOLOGY FOR LANDSLIDE MONITORING 

### **Recommended technology stack** 

|**Component**|**Recommended technologies**<br>l|
|---|---|
|Frontend/WebGIS|React/Next.js,Leaflet or comparable WebGIS framework|
|Backend|Python,FastAPI|
|Spatial database|PostgreSQL + PostGIS|
|Geospatialprocessing|GDAL,Rasterio,GeoPandas,Shapely, QGIS|
|Satellite processing|Google Earth Engine / Copernicus Data Space / dedicated SAR<br>tools|
|Machine learning|Scikit-learn,XGBoost,PyTorch/TensorFlow where required|
|Visualisation|Interactive GIS layers, time series, charts and explainable<br>alertpanels|



### **Validation strategy** 

Historical landslide events should be divided into training, validation and test sets. Spatial and temporal leakage should be avoided; otherwise nearby events from the same period can make performance look unrealistically high. 

|**Metric**|**Purpose**|
|---|---|
|Precision|How many predicted positive locations/events are actually<br>positive|
|Recall|How manyactual landslide cases are detected|
|F1 score|Balancesprecision and recall|
|ROC-AUC|Measures ranking/discriminationperformance|
|Spatial validation|Tests whether the modelgeneralises to new areas|
|Temporal validation|Testsperformance on later/unseen events|



### **False-alarm control** 

Use multi-signal confirmation. For example, a high susceptibility location combined with an extreme rainfall episode and elevated wetness can be escalated further if satellite deformation or change detection also supports the signal. Thresholds should be learned/calibrated using historical events and field verification. 

### **What the system should and should not claim** 

|**Should claim**<br>i|**Should not claim**|
|---|---|
|Identifies high-susceptibilitylocations|Perfectly predicts the exact time of everylandslide|
|Detects satellite-observable deformation/change|Everydetected change is a landslideprecursor<br>i|
|Provides dynamic hazard information|Satellite data alone can replace all field monitoring|
|Prioritises exposed communities and infrastructure|Everyalert isguaranteed to result in a landslide|



### **Final SIH positioning** 

The proposed solution is best positioned as an AI-assisted, multi-source geospatial decision-support platform. Its differentiator is the fusion of satellite deformation, optical change, terrain susceptibility, rainfall, soil moisture, historical events and infrastructure exposure into an explainable risk workflow. 

Technical Research & System Design 

SMART INDIA HACKATHON | SATELLITE & GIS TECHNOLOGY FOR LANDSLIDE MONITORING 

## **Technical Appendix — Dataset & Feature Matrix** 

|**Dataset / Source Type**|**Variables**|**Role**|**Spatial/Temporal**<br>**Consideration**|
|---|---|---|---|
|Sentinel-1 SAR|Backscatter, coherence,<br>interferometricphase|Deformation and radar<br>change|Repeat observations;<br>geometry/coherence matter|
|Sentinel-2|Visible, NIR, red-edge, SWIR|Vegetation, land cover,<br>surface change|Cloud screening required|
|Landsat|Multispectral/thermal bands|Historical baseline|Long-term record; coarser than<br>some modern opticalproducts|
|SRTM / DEM|Elevation|Slope/aspect/terrain|Static terrain layer|
|Bhuvan/CartoDEM|Indian elevation products|Higher-context terrain<br>analysis|Availability/resolution depend<br>onproduct|
|GPM/IMERG|Precipitation|Trigger and accumulation<br>features|Regional precipitation estimate|
|Soil moisture|Surface wetness/moisture|Dynamic wetness context|Often coarse relative to<br>individual slopes|
|Historical landslide inventory|Location/date/event<br>attributes|Training and validation|Quality and reporting bias must<br>be assessed|
|Road/building/facilityGIS|Geometryand attributes|Exposure analysis|Update frequencymatters|



### **Implementation Roadmap** 

1. Select one pilot region and define a fixed spatial grid or analysis unit. 

2. Collect and standardise historical landslide events. 

3. Acquire DEM, Sentinel-1, Sentinel-2 and rainfall datasets. 

4. Generate terrain derivatives and satellite indices. 

5. Build the baseline susceptibility model. 

6. Add dynamic rainfall and soil-moisture features. 

7. Implement Sentinel-1 deformation/change monitoring where feasible. 

8. Add infrastructure exposure and affected-population analysis. 

9. Train and validate the AI/ML model using strict spatial/temporal splits. 

10. Build the WebGIS dashboard and explainable alert engine. 

11. Run retrospective testing on known landslide events. 

12. Conduct field verification and calibrate thresholds before operational deployment. 

## **Key References / Official Data Portals** 

- European Space Agency (ESA) — Copernicus Sentinel-1 mission documentation. 

- European Space Agency (ESA) — Copernicus Sentinel-2 mission and instrument documentation. 

- U.S. Geological Survey (USGS) — Landsat mission and Landsat 8/9 documentation. 

- NASA Earthdata — SRTM/DEM resources and geospatial data services. 

- NASA Global Precipitation Measurement (GPM) — IMERG precipitation products. 

- NASA Earthdata — SMAP soil-moisture products. 

- ISRO/NRSC Bhuvan — Indian geospatial and CartoDEM resources. 

- NASA Global Landslide Catalog — historical rainfall-triggered landslide event information. 

_Note: Dataset availability, product versions, spatial resolution and access policies can change. For the final SIH submission, cite the exact product/version and acquisition date used in the prototype._ 

Technical Research & System Design 

