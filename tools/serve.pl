#!/usr/bin/perl
# Tiny static file server for local preview: perl tools/serve.pl [port]
use strict; use warnings; use IO::Socket::INET; use File::Basename;
my $port = shift || 8123; my $root = dirname(dirname(__FILE__)); $root = "." if $root eq "";
my %types = (html=>"text/html; charset=utf-8", css=>"text/css", js=>"application/javascript; charset=utf-8", jpg=>"image/jpeg", jpeg=>"image/jpeg", png=>"image/png", gif=>"image/gif", svg=>"image/svg+xml", json=>"application/json", txt=>"text/plain");
my $srv = IO::Socket::INET->new(LocalAddr=>"127.0.0.1", LocalPort=>$port, Listen=>20, ReuseAddr=>1) or die "listen: $!";
print "serving $root on http://localhost:$port\n"; $| = 1;
while (my $c = $srv->accept) {
    my $req = <$c>; next unless $req;
    while (my $l = <$c>) { last if $l =~ /^\r?\n$/ }
    my ($path) = $req =~ m{^GET\s+(\S+)}; $path //= "/"; $path =~ s/\?.*//; $path =~ s/%([0-9A-Fa-f]{2})/chr(hex($1))/ge;
    $path =~ s/\.\.//g; my $f = "$root$path"; $f .= "index.html" if $f =~ m{/$}; $f .= "/index.html" if -d $f;
    if (-f $f && open(my $fh, "<:raw", $f)) {
        my ($ext) = $f =~ /\.(\w+)$/; my $t = $types{lc($ext // "")} // "application/octet-stream";
        local $/; my $body = <$fh>; close $fh;
        print $c "HTTP/1.1 200 OK\r\nContent-Type: $t\r\nContent-Length: " . length($body) . "\r\nCache-Control: no-store\r\nConnection: close\r\n\r\n$body";
    } else { print $c "HTTP/1.1 404 Not Found\r\nContent-Length: 9\r\nConnection: close\r\n\r\nNot found"; }
    close $c;
}
