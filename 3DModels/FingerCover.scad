/*
* FingerCover
* "Parametric" model of a finger sheild. 
* Sheilds the sensory circuitry (IR LED and photodiode) from some 
* ambient light fluctuation/noise. 
*
* @author: Suyash Kumar
*/
$fn=100; // Explicitly sets resolution of arcs
// Parameters: 
led_dia=5.8; // Diameter of the led/photodiode slot
led_rad=led_dia/2; // led/photodiode slot
finger_radius=11; // Outer radius of finger cap cylinder
base_length=24; // Length of the rectangular base
base_width=19; 
base_height=6.5;
wall_thickness=2; // Wall thickness of circular canopy
rear_wall_thickness=4; // Thickness of the rear wall

function determineOffset(r,w)=sqrt((r*r)-(w/2)*(w/2)); // Determines finger cap cylinder offset to align with base

module make_bottom(){
	difference(){
		cube([base_length,base_width,base_height],center=true);
		translate([-base_length/4,0,0]) cylinder(h=base_height, r=led_rad,center=true); // First hole 
		translate([(-base_length/4)+led_dia+2.8,0,0]) cylinder(h=base_height, r=led_dia/2,center=true);	// Second hole
	}
}
module cap_cyl(){
	rotate([0,90,0]) translate([-determineOffset(finger_radius,base_width)-0.5*base_height,0,0]) cylinder(r=finger_radius,h=base_length,center=true); // Makes main finger sheild cylinder
}
module make_canopy(){
	difference(){
		cap_cyl();//Main cylinder
		translate([0,0,0]) cube([base_length*1.5,base_width,base_height], center=true); // base cutoff
		rotate([0,90,0]) translate([-determineOffset(finger_radius,base_width)-0.5*base_height,0,-rear_wall_thickness]) cylinder(r=finger_radius-wall_thickness,h=base_length,center=true); //inner cyl cut out		
	}
}
module make_cover(){
	make_bottom();
	make_canopy();
}
make_cover();