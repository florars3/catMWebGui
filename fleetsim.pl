#!/opt/tools/tools/perl/5.12.2/bin/perl

# #!/usr/bin/perl
##############################################################################
# fleetsim.pl
# By Chris Spencer (christopher.b.spencer@ericsson.com), 
#    DURA LMR TDS
#    Ottawa, Ontario, CANADA
# (c) Ericsson Canada Inc.
#
# Synopsis:
# --------
#
# Version History:
# ---------------
# v0.10 2016/10/14 Chris Spencer
# - Original version.  Generate JSON data files for each 'truck' in the fleet,
#   to provide simulated demo data for the IoT CAT-M fleet management demo.
##############################################################################
$| = 1;

##############################################################################
# libraries
##############################################################################
use File::Basename;
use Time::Local;
use Time::HiRes qw(sleep time);
use Text::Wrap;
use Cwd;

##############################################################################
# globals
##############################################################################
my $VERSION = '0.10a';
my($SCRIPT, $PATH, $EXT) = fileparse($0, '.pl');
my $DEBUG = 0; # set by -d command-line option

# Change the following Author values as needed.
my $AuthorName = 'Chris Spencer B.';
my $AuthorEmail = 'christopher.b.spencer@ericsson.com';
my $AuthorDept = 'DURA LMR TDS';
my $AuthorCompany = 'Ericsson Canada Inc.';
my $AuthorLocation = 'Ottawa, ON, Canada';

my $OUTEXT = '.json'; # output file extension

# the following characters need to be escaped in regexes
my $SpecialChars = '[\\\/\'\"\(\)\[\]\^\?\*\+\{\}\$]';

# date/time globals
my $runTm = time();
my @MONS = qw(JAN FEB MAR APR MAY JUN JUL AUG SEP OCT NOV DEC);
my @WEEKDAYS = qw(SUN MON TUE WED THU FRI SAT);
my $MINUTE = 60; # seconds
my $HOUR = 60 * $MINUTE; 
my $DAY = 24 * $HOUR; 
my $WEEK = 7 * $DAY; 
my $MONTH = 30 * $DAY;
my $QUARTER = 91 * $DAY;
my $YEAR = 365 * $DAY;
my $MODTIME = 9; # index of file modtime in stat() output
my $COPYRIGHTYEAR = &getYear();

my $REFRESH_SECS = 5;
my $REFRESH_MS = int($REFRESH_SECS * 1000);

my $maxSecs = 1800; # maximum demo duration in seconds
my $startTm = time();

##############################################################################
# Truck info
##############################################################################
my $MaxTrucks = 3;
my @Routes = (); # route for each truck
my @Index = (); # route index for each truck
my @Drivers = (
    "Homer Simpson",
    "Bender",
    "Peter Griffin"
   );
my @Trucks = (
    "Maximum Homerdrive",
    "Old Bessie",
    "Freakin' Sweet"
   );
   
my @Accident = (); # truck accident flags
my @Door = (); # truck door flags
my @Temperature = ();

my $AccidentDelay = 2 * $MINUTE;
my $DoorDelay = 30;

my $NominalTemp = 3;
my $LoTemp = 0;
my $HiTemp = 6;

##############################################################################
# main
##############################################################################
$SIG{INT} = \&ctrlC; # Ctrl-C interrupt handler

&stderr("$SCRIPT$EXT v$VERSION");
&stderr('-' x length("$SCRIPT$EXT"));

&parseArgs;
&runSimulation;

&quit;

##############################################################################
# subroutines
##############################################################################

##############################################################################
sub quit
{
 &resetTrucks;
 &displayRunDuration;
 exit(0);
}
##############################################################################
sub ctrlC
{
 &warning("User typed Ctrl-C.  Exiting.");
 &quit;
}

##############################################################################
sub parseArgs
{
 # Process all command-line arguments
 my $arg;

 while(@ARGV)
   {
    $arg = shift(@ARGV);

    if($arg eq '-h' || $arg eq '-?') # help
      {
       &help;
       exit;
      }
    elsif($arg eq '-d') # debug
      { $DEBUG = 1; } # debug mode is enabled
   elsif($arg eq '-t') # test time
      { 
       my $dur  = shift(@ARGV);
       if($dur >= $MIN && $dur <= $DAY)
         { $maxSec = $dur; }
       else 
         { &warning("Invalid simulation duration specified: $dur"); }
      }
  } # end while argv 
}

##############################################################################
sub help
{
 print STDERR <<EOH;

Syntax: $SCRIPT$EXT {options} 

Generate JSON data for the IoT CAT-M Fleet Management demo.

Options:
-t <secs>: Simulation time, in seconds.  Default: $maxSecs seconds
-h : This help.
-d : Debug mode.

By $AuthorName ($AuthorEmail), $AuthorDept
   $AuthorCompany, $AuthorLocation
EOH
 &stderr("(c) ".&getYear());
}

##############################################################################
sub stderr
{
 my($msg) = join(" ", @_);
 print STDERR "$msg\n";
}

##############################################################################
sub error
{
 my($err) = join(" ", @_);
 &stderr("FATAL ERROR: $err");
 exit;
}

##############################################################################
sub warning
{
 my($msg) = join(" ", @_);
 &stderr("Warning: $msg"); 
}

##############################################################################
sub debug
{
 my($msg) = join(" ", @_);
 &stderr("DEBUG: $msg") if $DEBUG;
}

##############################################################################
sub trim
{
 # remove leading and trailing whitespace from the given string.
 my($str) = @_;
 $str =~ s/^\s*//; # leading spaces
 $str =~ s/\s*$//; # trailing spaces
 return $str;
}

##############################################################################
sub escape
{
 # Escape any special characters in the given string.  Used prior to performing
 # regex searches on the string.
 my($str) = @_;
 $str =~ s/($SpecialChars)/\\$1/g; # escape special chars
 return $str;
}

##############################################################################
sub clean
{
 # Remove special characters from the given string.
 my($str) = @_;
 $str =~ s/($SpecialChars)//g; # remove special chars
 $str =~ s/[^[:print:]]+//g; # remove non-printable characters
 return $str;
}

##############################################################################
sub getYear
{
 # Return the 4-digit year for the given epoch-time (tm).
 my($tm) = @_;
 $tm = time() unless $tm;
 my $year = (localtime($tm))[5];
 $year += 1900 if($year < 1900);
 return $year;
}

##############################################################################
sub getDate
{
 # Return an all-numeric date string for the given epoch-time (tm) or
 # current system time.
 my($tm) = @_;
 $tm = time() unless $tm;
 my($ss, $mi, $hr, $dd, $mo, $yr) = localtime($tm);
 return sprintf("%04d%02d%02d", $yr+1900, $mo+1, $dd);
}

##############################################################################
sub getDttm
{
 # Return an all-numeric date/time string for the given epoch-time (tm) or
 # current system time.
 my($tm) = @_;
 $tm = time() unless $tm;
 my($ss, $mi, $hr, $dd, $mo, $yr) = localtime($tm);
 return sprintf("%04d%02d%02dT%02d%02d", $yr+1900, $mo+1, $dd, $hr, $mi);
}

##############################################################################
sub getDttms
{
 # Return an all-numeric date/time string (with seconds) for the given 
 # epoch-time (tm) or current system time.
 my($tm) = @_;
 $tm = time() unless $tm;
 my($ss, $mi, $hr, $dd, $mo, $yr) = localtime($tm);
 return sprintf("%04d%02d%02dT%02d%02d%02d", $yr+1900, $mo+1, $dd, $hr, $mi, $ss);
}

##############################################################################
sub getTm
{
 # return the epoch-time for the given date and time.
 my($date, $time) = @_;
 my($ss, $mi, $hr, $dd, $mo, $year);

 return time() unless $date;

 if($date =~ /\dT\d/i) # format: yyyymmddThhmmss et al
   { ($date, $time) = split(/T/i, $date, 2); }

 $time = '00:00:00' unless $time; # midnight

 # yyyymmdd, yyyy-mm-dd, or yyyy/mm/dd
 if($date =~ /^(\d{4})[\-\/]?(\d\d)[\-\/]?(\d\d)$/) 
   {
    $year = $1;
    $mo = $2;
    $dd = $3;
   }
 elsif($date =~ /^(\w+) (\d+)\s+(\d{1,2}:\d\d:\d\d) ([A-Z]+) (\d{4})/)
   {
    # Unix date/time: mmm dd hh:mm:ss tz yyyy
    $mo = &getMonNo($1);
    $dd = $2;
    $time = $3;
    $year = $5;
   }
 elsif($date =~ /^\w+ (\w+)\s+(\d+) (\d{1,2}:\d\d:\d\d) ([A-Z]+) (\d{4})/)
   {
    # alt Unix date/time: wday mmm dd hh:mm:ss tz yyyy
    $mo = &getMonNo($1);
    $dd = $2;
    $time = $3;
    $year = $5;
   }
 elsif($date =~ /^(\d{1,2}) (\w{3}) (\d{4}) (\d{1,2}:\d\d:\d\d)$/)
   {
    # CEMS/BSSM cliapp SystemTime format
    $dd = $1;
    $mo = &getMonNo($2);
    $year = $3;
    $time = $4;
   }
 else
   { &error("Invalid date format: $date"); }

 # hh:mm:ss or hhmmss
 if($time =~ /^(\d{1,2})\:?(\d\d)\:?(\d\d)$/) 
   {
    $hr = $1;
    $mi = $2;
    $ss = $3;
   }
 elsif($time =~ /^(\d{1,2})\:?(\d\d)$/) # hh:mm or hhmm
   {
    $hr = $1;
    $mi = $2;
    $ss = '00';
   }
 else
   { &error("Invalid time format: $time"); }

 if($mo < 1 || $mo > 12)
   { &error("Invalid month: $date"); }
   
 return timelocal($ss, $mi, $hr, $dd, $mo-1, $year);
}

##############################################################################
sub getMonNo
{
 # Return the number of the given month, or -1 if not found
 my($mon) = @_;
 $mon = uc(substr($mon, 0, 3));
 foreach my $m (0..11)
   {
    if($mon eq $MONS[$m])
      { return $m+1; }
   }
 return -1;
}

##############################################################################
sub displayRunDuration
{
 my $duration = time() - $runTm;
 if($duration > 7200) # 2 hours
   { &stderr(sprintf("Run Duration: %0.2f hours", $duration/3600)); }
 elsif($duration > 120) # 2 mins
   { &stderr(sprintf("Run Duration: %0.1f minutes", $duration/60)); }
 else
   { &stderr(sprintf("Run Duration: %d seconds", $duration)); }
}

##############################################################################
sub runSimulation
{
 &stderr("Running simulation.  Type 'Ctrl C' at anytime to end simulation.");
 my $diff = 0;
 my $now;
 
 # read route data for each truck
 &stderr("Reading truck route info ...");
 foreach my $truck (0..$MaxTrucks-1)
   { 
    &readTruckRoute($truck); 
    $Temperature[$truck] = $NominalTemp;
   }
 
 # sets trucks to their starting positions
 &resetTrucks;
 
 # countdown
 for(my $sec = 5; $sec > 0; $sec--)
   {
    &stderr("Simulation starts in $sec ...");
    sleep(1);
   }
 &stderr("Trucks are on the way!");
 
 # start truck simulation
 $startTm = time();
 while($diff < $maxSecs)
   {
    sleep($REFRESH_SECS);

    foreach my $truck (0..$MaxTrucks-1)
      {
       if($Index[$truck] > $#{$Routes[$truck]})
         { $Index[$truck] = 0; }
       
       my $accident = &getAccident($truck);
       my $door = &getDoor($truck);
       my $temperature = &getTemperature($truck);
       
       &updateJsonFile($truck, ${$Routes[$truck]}[$Index[$truck]], $Drivers[$truck], $Trucks[$truck],
          $accident, $door, $temperature);
	  
       # ensure truck stops moving if an accident or open door
       unless($accident || $door)
          { $Index[$truck]++; }
      }
        
    $now = time();
    $diff = $now - $startTm;
   } # end while diff
   
 &stderr("Simulation done.  Time expired ($maxSecs seconds).");
}

##############################################################################
sub resetTrucks
{
 foreach my $truck (0..$MaxTrucks-1)
   { &updateJsonFile($truck, ${$Routes[$truck]}[0], $Drivers[$truck], $Trucks[$truck], 0, 0, $NominalTemp); }
}

##############################################################################
sub getAccident
{
 my($truck) = @_;
 
 if($Accident[$truck] > 0)
   { $Accident[$truck] -= $REFRESH_SECS; }
 else # 1 percent chance of accident
   { 
    unless(int(rand(100)))
      { $Accident[$truck] = $AccidentDelay; }  
   }
   
 if($Accident[$truck] < 0)
  { $Accident[$truck] = 0; }

 if($Accident[$truck])
   { return 1; } # accident
 return 0; # no accident
}

##############################################################################
sub getDoor
{
 my($truck) = @_;
 
 if($Door[$truck] > 0)
   { $Door[$truck] -= $REFRESH_SECS; }
 else # 1 percent chance of accident
   { 
    unless(int(rand(100)))
      { $Door[$truck] = $DoorDelay; }  
   }
   
 if($Door[$truck] < 0)
  { $Door[$truck] = 0; }

  if($Door[$truck])
    { return 1; } # Door open

 return 0; # door closed
}

##############################################################################
sub getTemperature
{
 my($truck) = @_;
 
 if($Temperature[$truck] > $HiTemp)
   { $Temperature[$truck]--; }
 elsif($Temperature[$truck] < $LoTemp)
   { $Temperature[$truck]++; }
 
 my $factor = int(rand(10)); # 0..9
 
 if($factor == 1)
   { $Temperature[$truck]--; }
 elsif($factor == 9)
   { $Temperature[$truck]++; }
 
 return $Temperature[$truck]; 
}

##############################################################################
sub readTruckRoute
{
 my($truck) = @_;

 return if($truck < 0 || $truck !~ /^\d+$/);
 
 my $routeFile = $PATH."routes/route".$truck.".dat";
 if(open(DAT, $routeFile))
   {
    while(<DAT>)
      {
       chomp;
       next if(/^\s*$/ || /^\s*\#/); # ignore blank and comment lines
       next unless(/^[\s\d\-\.\,]+$/);
       s/\s//g; # remove whitespace
       push(@{$Routes[$truck]}, $_);
      }
    close(DAT);
   }
 else 
   { &warning("Could not read route file: $routeFile"); }
}

##############################################################################
sub updateJsonFile
{
 my($truckno, $coords, $driver, $truckname, $accident, $door, $temperature) = @_;
 
 my($lat,$lng) = split(/,/, $coords, 2);
 my $jsonFile = $PATH."json/truck".$truckno.$OUTEXT;
 
 if(open(DAT, ">$jsonFile"))
   {
    print DAT "{ ",
       "\"truck\": \"$truckno\", ",
       "\"name\": \"$truckname\", ",
       "\"driver\": \"$driver\", ",
       "\"lat\": $lat, ",
       "\"lng\": $lng, ",
       "\"accident\": $accident, ",
       "\"door\": $door, ",
       "\"temp\": $temperature ",
       "}";
    close(DAT);
   }
 else
   { &warning("Could not open data file for writing: $DatFile"); }
}

