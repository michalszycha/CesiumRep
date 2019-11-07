/**
 * <p>
 * Implementation of Thaddeus Vincenty's algorithms to solve the direct and
 * inverse geodetic problems. For more information, see Vincent's original
 * publication on the NOAA website:
 * </p>
 * See http://www.ngs.noaa.gov/PUBS_LIB/inverse.pdf
 * 
 * @class
 * @constructor
 * @author Dominic Graulich, <a href="http://dominic.graulichs.de">http://dominic.graulichs.de</a> (translating to JavaScript)
 * @see Mike Gavaghan (Java and C# version at <a href="http://www.gavaghan.org/blog/free-source-code/">http://www.gavaghan.org/blog/free-source-code/</a>)
 * @version ${project.version}
 */
var GeodeticCalculator = function(){
	
	var self = this;
	var TwoPi = 2.0 * Math.PI;

   /**
    * Calculate the destination and final bearing after traveling a specified
    * distance, and a specified starting bearing, for an initial location. This
    * is the solution to the direct geodetic problem.
    * 
		* @methodOf GeodeticCalculator#
		* @name calculateEndingGlobalCoordinates
		* @public
    * @param ellipsoid reference ellipsoid to use
    * @param start starting location
    * @param startBearing starting bearing (degrees)
    * @param distance distance to travel (meters)
    * @param [endBearing] bearing at destination (degrees) element at index 0 will be populated with the result
    * @return
    */
   self.calculateEndingGlobalCoordinates = function(/* Ellipsoid */ ellipsoid, /* GlobalCoordinates */ start, /* double */ startBearing, /* double */ distance, /* double[] */ endBearing){
      var a = ellipsoid.getSemiMajorAxis();
      var b = ellipsoid.getSemiMinorAxis();
      var aSquared = a * a;
      var bSquared = b * b;
      var f = ellipsoid.getFlattening();
      var phi1 = Angle.toRadians(start.getLatitude());
      var alpha1 = Angle.toRadians(startBearing);
      var cosAlpha1 = Math.cos(alpha1);
      var sinAlpha1 = Math.sin(alpha1);
      var s = distance;
      var tanU1 = (1.0 - f) * Math.tan(phi1);
      var cosU1 = 1.0 / Math.sqrt(1.0 + tanU1 * tanU1);
      var sinU1 = tanU1 * cosU1;

      // eq. 1
      var sigma1 = Math.atan2(tanU1, cosAlpha1);

      // eq. 2
      var sinAlpha = cosU1 * sinAlpha1;

      var sin2Alpha = sinAlpha * sinAlpha;
      var cos2Alpha = 1 - sin2Alpha;
      var uSquared = cos2Alpha * (aSquared - bSquared) / bSquared;

      // eq. 3
      var A = 1 + (uSquared / 16384) * (4096 + uSquared * (-768 + uSquared * (320 - 175 * uSquared)));

      // eq. 4
      var B = (uSquared / 1024) * (256 + uSquared * (-128 + uSquared * (74 - 47 * uSquared)));

      // iterate until there is a negligible change in sigma
      var deltaSigma;
      var sOverbA = s / (b * A);
      var sigma = sOverbA;
      var sinSigma;
      var prevSigma = sOverbA;
      var sigmaM2;
      var cosSigmaM2;
      var cos2SigmaM2;

      for (;;){
         // eq. 5
         sigmaM2 = 2.0 * sigma1 + sigma;
         cosSigmaM2 = Math.cos(sigmaM2);
         cos2SigmaM2 = cosSigmaM2 * cosSigmaM2;
         sinSigma = Math.sin(sigma);
         var cosSignma = Math.cos(sigma);

         // eq. 6
         deltaSigma = B * sinSigma * (cosSigmaM2 + (B / 4.0) * (cosSignma * (-1 + 2 * cos2SigmaM2) - (B / 6.0) * cosSigmaM2 * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM2)));

         // eq. 7
         sigma = sOverbA + deltaSigma;

         // break after converging to tolerance
         if (Math.abs(sigma - prevSigma) < 0.0000000000001){
					 break;
				 }

         prevSigma = sigma;
      }

      sigmaM2 = 2.0 * sigma1 + sigma;
      cosSigmaM2 = Math.cos(sigmaM2);
      cos2SigmaM2 = cosSigmaM2 * cosSigmaM2;

      var cosSigma = Math.cos(sigma);
      sinSigma = Math.sin(sigma);

      // eq. 8
      var phi2 = Math.atan2(sinU1 * cosSigma + cosU1 * sinSigma * cosAlpha1, (1.0 - f) * Math.sqrt(sin2Alpha + Math.pow(sinU1 * sinSigma - cosU1 * cosSigma * cosAlpha1, 2.0)));

      // eq. 9
      // This fixes the pole crossing defect spotted by Matt Feemster. When a
      // path passes a pole and essentially crosses a line of latitude twice -
      // once in each direction - the longitude calculation got messed up. Using
      // atan2 instead of atan fixes the defect. The change is in the next 3
      // lines.
      // double tanLambda = sinSigma * sinAlpha1 / (cosU1 * cosSigma - sinU1 * sinSigma * cosAlpha1);
      // double lambda = Math.atan(tanLambda);
      var lambda = Math.atan2(sinSigma * sinAlpha1, (cosU1 * cosSigma - sinU1 * sinSigma * cosAlpha1));

      // eq. 10
      var C = (f / 16) * cos2Alpha * (4 + f * (4 - 3 * cos2Alpha));

      // eq. 11
      var L = lambda - (1 - C) * f * sinAlpha * (sigma + C * sinSigma * (cosSigmaM2 + C * cosSigma * (-1 + 2 * cos2SigmaM2)));

      // eq. 12
      var alpha2 = Math.atan2(sinAlpha, -sinU1 * sinSigma + cosU1 * cosSigma * cosAlpha1);

      // build result
      var latitude = Angle.toDegrees(phi2);
      var longitude = start.getLongitude() + Angle.toDegrees(L);

      if ((!!endBearing) && (endBearing.length > 0)){
         endBearing[0] = Angle.toDegrees(alpha2);
      }

      return new GlobalCoordinates(latitude, longitude);
   };

   /**
    * Calculate the geodetic curve between two points on a specified reference
    * ellipsoid. This is the solution to the inverse geodetic problem.
    * 
		* @methodOf GeodeticCalculator#
		* @name calculateGeodeticCurve
		* @public
    * @param ellipsoid reference ellipsoid to use
    * @param start starting coordinates
    * @param end ending coordinates
    * @return
    */
   self.calculateGeodeticCurve = function(/* Ellipsoid */ ellipsoid, /* GlobalCoordinates */ start, /* GlobalCoordinates */ end){
      //
      // All equation numbers refer back to Vincenty's publication:
      // See http://www.ngs.noaa.gov/PUBS_LIB/inverse.pdf
      //

      // get constants
      var a = ellipsoid.getSemiMajorAxis();
      var b = ellipsoid.getSemiMinorAxis();
      var f = ellipsoid.getFlattening();

      // get parameters as radians
      var phi1 = Angle.toRadians(start.getLatitude());
      var lambda1 = Angle.toRadians(start.getLongitude());
      var phi2 = Angle.toRadians(end.getLatitude());
      var lambda2 = Angle.toRadians(end.getLongitude());

      // calculations
      var a2 = a * a;
      var b2 = b * b;
      var a2b2b2 = (a2 - b2) / b2;

      var omega = lambda2 - lambda1;

      var tanphi1 = Math.tan(phi1);
      var tanU1 = (1.0 - f) * tanphi1;
      var U1 = Math.atan(tanU1);
      var sinU1 = Math.sin(U1);
      var cosU1 = Math.cos(U1);

      var tanphi2 = Math.tan(phi2);
      var tanU2 = (1.0 - f) * tanphi2;
      var U2 = Math.atan(tanU2);
      var sinU2 = Math.sin(U2);
      var cosU2 = Math.cos(U2);

      var sinU1sinU2 = sinU1 * sinU2;
      var cosU1sinU2 = cosU1 * sinU2;
      var sinU1cosU2 = sinU1 * cosU2;
      var cosU1cosU2 = cosU1 * cosU2;

      // eq. 13
      var lambda = omega;

      // intermediates we'll need to compute 's'
      var A = 0.0;
      var B = 0.0;
      var sigma = 0.0;
      var deltasigma = 0.0;
      var lambda0;
      var converged = false;

      for (var i = 0; i < 20; i++){
         lambda0 = lambda;

         var sinlambda = Math.sin(lambda);
         var coslambda = Math.cos(lambda);

         // eq. 14
         var sin2sigma = (cosU2 * sinlambda * cosU2 * sinlambda) + (cosU1sinU2 - sinU1cosU2 * coslambda) * (cosU1sinU2 - sinU1cosU2 * coslambda);
         var sinsigma = Math.sqrt(sin2sigma);

         // eq. 15
         var cossigma = sinU1sinU2 + (cosU1cosU2 * coslambda);

         // eq. 16
         sigma = Math.atan2(sinsigma, cossigma);

         // eq. 17 Careful! sin2sigma might be almost 0!
         var sinalpha = (sin2sigma === 0) ? 0.0 : cosU1cosU2 * sinlambda / sinsigma;
         var alpha = Math.asin(sinalpha);
         var cosalpha = Math.cos(alpha);
         var cos2alpha = cosalpha * cosalpha;

         // eq. 18 Careful! cos2alpha might be almost 0!
         var cos2sigmam = cos2alpha === 0.0 ? 0.0 : cossigma - 2 * sinU1sinU2 / cos2alpha;
         var u2 = cos2alpha * a2b2b2;

         var cos2sigmam2 = cos2sigmam * cos2sigmam;

         // eq. 3
         A = 1.0 + u2 / 16384 * (4096 + u2 * (-768 + u2 * (320 - 175 * u2)));

         // eq. 4
         B = u2 / 1024 * (256 + u2 * (-128 + u2 * (74 - 47 * u2)));

         // eq. 6
         deltasigma = B * sinsigma * (cos2sigmam + B / 4 * (cossigma * (-1 + 2 * cos2sigmam2) - B / 6 * cos2sigmam * (-3 + 4 * sin2sigma) * (-3 + 4 * cos2sigmam2)));

         // eq. 10
         var C = f / 16 * cos2alpha * (4 + f * (4 - 3 * cos2alpha));

         // eq. 11 (modified)
         lambda = omega + (1 - C) * f * sinalpha * (sigma + C * sinsigma * (cos2sigmam + C * cossigma * (-1 + 2 * cos2sigmam2)));

         // see how much improvement we got
         var change = Math.abs((lambda - lambda0) / lambda);

         if ((i > 1) && (change < 0.0000000000001)){
            converged = true;
            break;
         }
      }

      // eq. 19
      var s = b * A * (sigma - deltasigma);
      var alpha1;
      var alpha2;

      // didn't converge? must be N/S
      if (!converged)
      {
         if (phi1 > phi2)
         {
            alpha1 = 180.0;
            alpha2 = 0.0;
         }else if (phi1 < phi2){
            alpha1 = 0.0;
            alpha2 = 180.0;
         }else{
            alpha1 = NaN;
            alpha2 = NaN;
         }
      }

      // else, it converged, so do the math
      else
      {
         var radians;

         // eq. 20
         radians = Math.atan2(cosU2 * Math.sin(lambda), (cosU1sinU2 - sinU1cosU2 * Math.cos(lambda)));
         if (radians < 0.0){
					 radians += TwoPi;
				 }
         alpha1 = Angle.toDegrees(radians);

         // eq. 21
         radians = Math.atan2(cosU1 * Math.sin(lambda), (-sinU1cosU2 + cosU1sinU2 * Math.cos(lambda))) + Math.PI;
         if (radians < 0.0){
					 radians += TwoPi;
				 }
         alpha2 = Angle.toDegrees(radians);
      }

      if (alpha1 >= 360.0){
				alpha1 -= 360.0;
			}
      if (alpha2 >= 360.0){
				alpha2 -= 360.0;
			}

      return new GeodeticCurve(s, alpha1, alpha2);
   };

   /**
    * <p>
    * Calculate the three dimensional geodetic measurement between two positions
    * measured in reference to a specified ellipsoid.
    * </p>
    * <p>
    * This calculation is performed by first computing a new ellipsoid by
    * expanding or contracting the reference ellipsoid such that the new
    * ellipsoid passes through the average elevation of the two positions. A
    * geodetic curve across the new ellisoid is calculated. The point-to-point
    * distance is calculated as the hypotenuse of a right triangle where the
    * length of one side is the ellipsoidal distance and the other is the
    * difference in elevation.
    * </p>
    * 
		* @methodOf GeodeticCalculator#
		* @name calculateGeodeticMeasurement
		* @public
    * @param refEllipsoid reference ellipsoid to use
    * @param start starting position
    * @param end ending position
    * @return
    */
   self.calculateGeodeticMeasurement = function(/* Ellipsoid */ refEllipsoid, /* GlobalPosition */ start, /* GlobalPosition */ end){
      // calculate elevation differences
      var elev1 = start.getElevation();
      var elev2 = end.getElevation();
      var elev12 = (elev1 + elev2) / 2.0;

      // calculate latitude differences
      var phi1 = Angle.toRadians(start.getLatitude());
      var phi2 = Angle.toRadians(end.getLatitude());
      var phi12 = (phi1 + phi2) / 2.0;

      // calculate a new ellipsoid to accommodate average elevation
      var refA = refEllipsoid.getSemiMajorAxis();
      var f = refEllipsoid.getFlattening();
      var a = refA + elev12 * (1.0 + f * Math.sin(phi12));
      var /* Ellipsoid */ ellipsoid = Ellipsoid.fromAAndF(a, f);

      // calculate the curve at the average elevation
      var /* GeodeticCurve */ averageCurve = self.calculateGeodeticCurve(ellipsoid, start, end);

      // return the measurement
      return new GeodeticMeasurement(averageCurve, elev2 - elev1);
   };
};