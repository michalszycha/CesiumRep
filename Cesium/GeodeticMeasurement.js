/**
 * This is the outcome of a three dimensional geodetic calculation. It
 * represents the path a between two GlobalPositions for a specified reference
 * ellipsoid.
 * 
 * @author Dominic Graulich, <a href="http://dominic.graulichs.de">http://dominic.graulichs.de</a> (translating to JavaScript)
 * @see Mike Gavaghan (Java and C# version at <a href="http://www.gavaghan.org/blog/free-source-code/">http://www.gavaghan.org/blog/free-source-code/</a>)
 * @version ${project.version}
 */
 
/**
 * Creates a new instance of GeodeticMeasurement (<b>multiple signatures</b>).
 * 
 * @class
 * @constructor
 * @param param1 {ellipsoidal distance in meters | GeodeticCurve}
 * @param param2 {azimuth in degrees | the change in elevation, in meters, going from the starting point to the ending point}
 * @param param3 {reverse azimuth in degrees | undefined}
 * @param param4 {the change in elevation, in meters, going from the starting point to the ending point | undefined}
 */
var GeodeticMeasurement = function(param1, param2, param3, param4){
	
	var self = this;

   /**
    * The elevation change, in meters, going from the starting to the ending
    * point.
    */
   self.mElevationChange = undefined;

   /** The distance travelled, in meters, going from one point to the next. */
   self.mP2P = undefined;
   
   self.curve = undefined;

   if(typeof param1 == 'number'){
	   var ellipsoidalDistance = param1;
	   var azimuth = param2;
	   var reverseAzimuth = param3;
	   var elevationChange = param4;
	   
		 self.curve = new GeodeticCurve(ellipsoidalDistance, azimuth, reverseAzimuth);
	   self.mElevationChange = elevationChange;
	   self.mP2P = Math.sqrt(ellipsoidalDistance * ellipsoidalDistance + self.mElevationChange * self.mElevationChange);
   }else if(param1 instanceof GeodeticCurve){
	   self.curve = param1;
	   self.mElevationChange = param2;
		 self.mP2P = Math.sqrt(param1.getEllipsoidalDistance() * param1.getEllipsoidalDistance() + self.mElevationChange * self.mElevationChange);
   }

   /**
    * Get the elevation change.
    *
		* @methodOf GeodeticMeasurement#
		* @name getElevationChange
		* @public
    * @return elevation change, in meters, going from the starting to the ending
    *         point
    */
   self.getElevationChange = function(){
      return self.mElevationChange;
   };

   /**
    * Get the point-to-point distance.
    * 
		* @methodOf GeodeticMeasurement#
		* @name getPointToPointDistance
		* @public
    * @return the distance travelled, in meters, going from one point to the
    *         next
    */
   self.getPointToPointDistance = function(){
      return self.mP2P;
   };

   /**
    * Get the GeodeticMeasurement as a string.
		*
		* @methodOf GeodeticMeasurement#
		* @name toString
		* @public
    */
   self.toString = function(){
	  var retVal = "";
      retVal += self.curve.toString();
      retVal += "elev12=";
      retVal += self.mElevationChange;
      retVal += ";p2p=";
      retVal += self.mP2P;

      return retVal;
   };
   
   /**
    * Get the EllipsoidalDistance
		*
		* @methodOf GeodeticMeasurement#
		* @name getEllipsoidalDistance
		* @public
    */
   self.getEllipsoidalDistance = function(){
      return self.curve.getEllipsoidalDistance();
   };

   /**
    * Get the azimuth.
		*
		* @methodOf GeodeticMeasurement#
		* @name getAzimuth
		* @public
    * @return azimuth in degrees
    */
   self.getAzimuth = function(){
      return self.curve.getAzimuth();
   };

   /**
    * Get the reverse azimuth.
		*
		* @methodOf GeodeticMeasurement#
		* @name getReverseAzimuth
		* @public
    * @return reverse azimuth in degrees
    */
   self.getReverseAzimuth = function(){
      return self.curve.getReverseAzimuth();
   };

};