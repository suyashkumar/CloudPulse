$fn=100;
led_dia=5.8;
led_rad=led_dia/2;
base_length=24;
base_width=19;
base_height=6.5;
wall_thickness=2;
function determineOffset(r,w)=sqrt((r*r)-(w/2)*(w/2));

module bottom(length,width,height){
	difference(){
		cube([length,width,height],center=true);
		translate([-length/4,0,0]) cylinder(h=height, r=led_rad,center=true);
		translate([(-length/4)+led_dia+2.8,0,0]) cylinder(h=height, r=led_dia/2,center=true);	
	}
}
module cap_cyl(rad, bottom_width, length){

	echo(determineOffset(rad,bottom_width));
	rotate([0,90,0]) translate([-determineOffset(rad,bottom_width)-0.5*base_height,0,0]) cylinder(r=rad,h=length,center=true); 

}
module make_cap(rad,bottom_width,length){
	difference(){
		cap_cyl(rad,bottom_width,length);
		translate([0,0,0]) cube([base_length*1.5,base_width,base_height], center=true); // base cutoff
		rotate([0,90,0]) translate([-determineOffset(rad,bottom_width)-0.5*base_height,0,-3]) cylinder(r=rad-wall_thickness,h=length,center=true); //inner cyl cut out
		
	}
}
bottom(base_length,base_width,base_height);
make_cap(11,base_width,base_length);
