#!/usr/bin/env python
"""
Copyright (C) 2010 Nick Drobchenko, nick@cnc-club.ru
Copyright (C) 2005 Aaron Spike, aaron@ekips.org

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
"""

from ffgeom import Point, Segment


def maxdist(points):
    ((p0x, p0y), (p1x, p1y), (p2x, p2y), (p3x, p3y)) = points
    p0 = Point(p0x, p0y)
    p1 = Point(p1x, p1y)
    p2 = Point(p2x, p2y)
    p3 = Point(p3x, p3y)

    s1 = Segment(p0, p3)
    return max(s1.distanceToPoint(p1), s1.distanceToPoint(p2))


def cspsubdiv(csp, flat):
    for sp in csp:
        subdiv(sp, flat)


def subdiv(sp, flat, i=1):
    while i < len(sp):
        p0 = sp[i - 1][1]
        p1 = sp[i - 1][2]
        p2 = sp[i][0]
        p3 = sp[i][1]

        b = (p0, p1, p2, p3)
        m = maxdist(b)
        if m <= flat:
            i += 1
        else:
            one, two = beziersplitatt(b, 0.5)
            sp[i - 1][2] = one[1]
            sp[i][0] = two[2]
            p = [one[2], one[3], two[1]]
            sp[i:1] = [p]


def tpoint(point1, point2, t):
    (x1, y1) = point1
    (x2, y2) = point2
    return x1 + t * (x2 - x1), y1 + t * (y2 - y1)

def beziersplitatt(points, t):
    ((bx0, by0), (bx1, by1), (bx2, by2), (bx3, by3)) = points
    m1 = tpoint((bx0, by0), (bx1, by1), t)
    m2 = tpoint((bx1, by1), (bx2, by2), t)
    m3 = tpoint((bx2, by2), (bx3, by3), t)
    m4 = tpoint(m1, m2, t)
    m5 = tpoint(m2, m3, t)
    m = tpoint(m4, m5, t)

    return ((bx0, by0), m1, m4, m), (m, m5, m3, (bx3, by3))

