resource "aws_vpc" "main" {
  cidr_block = var.cidr
  tags = {
    Name = var.name
  }
}

resource "aws_subnet" "public" {
  count = 2
  vpc_id = aws_vpc.main.id
  cidr_block = cidrsubnet(var.cidr, 4, count.index)
  availability_zone = element(var.azs, count.index)
  map_public_ip_on_launch = true
  tags = {
    Name = "${var.name}-public-${count.index}"
  }
}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id
  tags = { Name = "${var.name}-igw" }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }
  tags = { Name = "${var.name}-public-rt" }
}

resource "aws_route_table_association" "public" {
  count = 2
  subnet_id = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}
