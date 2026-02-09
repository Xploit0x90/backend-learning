import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Home, Users, Tag, Sun, Moon } from 'lucide-react';
import {
  Box,
  Flex,
  Button,
  Heading,
  chakra,
} from '@chakra-ui/react';
import '../App.css';

interface BaseLayoutProps {
  children: React.ReactNode;
}

export const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === "true";
  });

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem("darkMode", String(newMode));
      return newMode;
    });
  };

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
  }, [darkMode]);

  const isActive = (path: string) => {
    if (path === '/home') {
      return location.pathname === '/' || location.pathname === '/home';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Box className="App" minH="100vh" position="relative">
      {/* Glassy Navbar */}
      <chakra.nav
        className="navbar-glass"
        position="fixed"
        top={{ base: '10px', md: '20px' }}
        left={{ base: '10px', md: '20px' }}
        right={{ base: '10px', md: '20px' }}
        height={{ base: '60px', md: '70px', lg: '80px' }}
        bg={darkMode ? 'rgba(32, 32, 30, 0.65)' : 'rgba(255, 255, 255, 0.7)'}
        backdropFilter="blur(20px)"
        border={darkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(204, 197, 185, 0.3)'}
        borderRadius={{ base: '16px', md: '20px' }}
        boxShadow={darkMode ? '0 8px 32px rgba(0, 0, 0, 0.4)' : '0 8px 32px rgba(0, 0, 0, 0.08)'}
        display="flex"
        alignItems="center"
        padding={{ base: '0 10px', sm: '0 15px', md: '0 25px', lg: '0 30px' }}
        zIndex={1000}
        transition="all 0.3s ease"
        gap={{ base: '6px', sm: '8px', md: '12px' }}
        _hover={{
          bg: darkMode ? 'rgba(38, 38, 36, 0.8)' : 'rgba(255, 255, 255, 0.85)',
          boxShadow: darkMode ? '0 12px 40px rgba(0, 0, 0, 0.5)' : '0 12px 40px rgba(0, 0, 0, 0.12)',
        }}
      >
        <Box 
          flex="1 1 auto"
          minWidth="0"
          overflow="hidden"
          marginRight={{ base: '4px', sm: '8px' }}
        >
          <Heading
            as="h1"
            className="navbar-title"
            fontSize={{ base: '13px', sm: '16px', md: '22px', lg: '24px' }}
            fontWeight={700}
            color={darkMode ? "#d4d2ce" : "#252422"}
            letterSpacing="-0.5px"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
            width="100%"
          >
            Event Manager
          </Heading>
        </Box>
        
        <Box 
          flex="1" 
          maxW="500px" 
          margin={{ base: '0', md: '0 30px', lg: '0 40px' }}
          display={{ base: 'none', lg: 'block' }}
        >
          {/* Global search bar can be added here later */}
        </Box>

        <Flex alignItems="center" gap={{ base: '6px', sm: '8px', md: '12px', lg: '15px' }} flexShrink={0} flexGrow={0} flexBasis="auto">
          {/* Dark Mode Toggle */}
          <Button
            className="icon-btn theme-toggle"
            onClick={toggleDarkMode}
            width={{ base: '32px', sm: '36px', md: '44px', lg: '48px' }}
            height={{ base: '32px', sm: '36px', md: '44px', lg: '48px' }}
            bg="rgba(235, 94, 40, 0.1)"
            borderRadius={{ base: '10px', md: '12px' }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="#403D39"
            padding="0"
            minWidth="auto"
            _hover={{
              bg: '#EB5E28',
              color: 'white',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 20px rgba(235, 94, 40, 0.3)',
            }}
            _dark={{
              bg: 'rgba(235, 94, 40, 0.15)',
              color: '#f6f4f0',
            }}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </Flex>
      </chakra.nav>

      {/* Sidebar Navigation */}
      <chakra.aside
        className="sidebar"
        position="fixed"
        left={{ base: '10px', md: '20px' }}
        top={{ base: '80px', md: '100px', lg: '120px' }}
        width={{ base: '160px', sm: '180px', md: '220px', lg: '240px' }}
        bg={darkMode ? 'rgba(32, 32, 30, 0.65)' : 'rgba(255, 255, 255, 0.7)'}
        backdropFilter="blur(20px)"
        border={darkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(204, 197, 185, 0.3)'}
        borderRadius={{ base: '16px', md: '20px' }}
        padding={{ base: '8px 0', sm: '12px 0', md: '16px 0', lg: '20px 0' }}
        boxShadow={darkMode ? '0 8px 32px rgba(0, 0, 0, 0.4)' : '0 8px 32px rgba(0, 0, 0, 0.08)'}
        zIndex={999}
        display="block"
      >
        <Flex
          as="nav"
          className="sidebar-nav"
          flexDirection="column"
          gap={{ base: '4px', sm: '6px', md: '8px' }}
          padding={{ base: '0 6px', sm: '0 8px', md: '0 10px', lg: '0 12px' }}
        >
          <Box
            as={Link}
            to="/home"
            className={`nav-item ${isActive('/home') ? 'active' : ''}`}
            position="relative"
            display="flex"
            alignItems="center"
            gap={{ base: '8px', sm: '10px', md: '12px' }}
            padding={{ base: '8px 10px', sm: '10px 14px', md: '12px 18px', lg: '14px 20px' }}
            color="#666"
            textDecoration="none"
            borderRadius={{ base: '10px', md: '12px' }}
            fontWeight={500}
            fontSize={{ base: '12px', sm: '14px', md: '15px' }}
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            _hover={{
              bg: 'rgba(235, 94, 40, 0.1)',
              color: '#EB5E28',
              transform: 'translateX(8px)',
              boxShadow: '0 4px 20px rgba(235, 94, 40, 0.15)',
            }}
            _dark={{
              color: '#cfcac3',
              _hover: {
                bg: 'rgba(235, 94, 40, 0.18)',
                color: '#EB5E28',
              },
            }}
            sx={{
              '&.active': {
                background: 'linear-gradient(135deg, #EB5E28 0%, #d94d1a 100%)',
                color: 'white',
                transform: 'translateX(5px)',
                boxShadow: '0 8px 25px rgba(235, 94, 40, 0.4)',
                '& svg': {
                  color: 'white',
                  transform: 'scale(1.1)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '4px',
                  height: '60%',
                  background: 'white',
                  borderRadius: '0 4px 4px 0',
                  boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
                },
                '&:hover': {
                  transform: 'translateX(5px)',
                  background: 'linear-gradient(135deg, #EB5E28 0%, #d94d1a 100%)',
                },
              },
            }}
          >
            <Home size={20} />
            <span>Home</span>
          </Box>

          <Box
            as={Link}
            to="/events"
            className={`nav-item ${isActive('/events') ? 'active' : ''}`}
            position="relative"
            display="flex"
            alignItems="center"
            gap={{ base: '8px', sm: '10px', md: '12px' }}
            padding={{ base: '8px 10px', sm: '10px 14px', md: '12px 18px', lg: '14px 20px' }}
            color="#666"
            textDecoration="none"
            borderRadius={{ base: '10px', md: '12px' }}
            fontWeight={500}
            fontSize={{ base: '12px', sm: '14px', md: '15px' }}
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            _hover={{
              bg: 'rgba(235, 94, 40, 0.1)',
              color: '#EB5E28',
              transform: 'translateX(8px)',
              boxShadow: '0 4px 20px rgba(235, 94, 40, 0.15)',
            }}
            _dark={{
              color: '#cfcac3',
              _hover: {
                bg: 'rgba(235, 94, 40, 0.18)',
                color: '#EB5E28',
              },
            }}
            sx={{
              '&.active': {
                background: 'linear-gradient(135deg, #EB5E28 0%, #d94d1a 100%)',
                color: 'white',
                transform: 'translateX(5px)',
                boxShadow: '0 8px 25px rgba(235, 94, 40, 0.4)',
                '& svg': {
                  color: 'white',
                  transform: 'scale(1.1)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '4px',
                  height: '60%',
                  background: 'white',
                  borderRadius: '0 4px 4px 0',
                  boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
                },
                '&:hover': {
                  transform: 'translateX(5px)',
                  background: 'linear-gradient(135deg, #EB5E28 0%, #d94d1a 100%)',
                },
              },
            }}
          >
            <Calendar size={20} />
            <span>Events</span>
          </Box>

          <Box
            as={Link}
            to="/participants"
            className={`nav-item ${isActive('/participants') ? 'active' : ''}`}
            position="relative"
            display="flex"
            alignItems="center"
            gap={{ base: '8px', sm: '10px', md: '12px' }}
            padding={{ base: '8px 10px', sm: '10px 14px', md: '12px 18px', lg: '14px 20px' }}
            color="#666"
            textDecoration="none"
            borderRadius={{ base: '10px', md: '12px' }}
            fontWeight={500}
            fontSize={{ base: '12px', sm: '14px', md: '15px' }}
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            _hover={{
              bg: 'rgba(235, 94, 40, 0.1)',
              color: '#EB5E28',
              transform: 'translateX(8px)',
              boxShadow: '0 4px 20px rgba(235, 94, 40, 0.15)',
            }}
            _dark={{
              color: '#cfcac3',
              _hover: {
                bg: 'rgba(235, 94, 40, 0.18)',
                color: '#EB5E28',
              },
            }}
            sx={{
              '&.active': {
                background: 'linear-gradient(135deg, #EB5E28 0%, #d94d1a 100%)',
                color: 'white',
                transform: 'translateX(5px)',
                boxShadow: '0 8px 25px rgba(235, 94, 40, 0.4)',
                '& svg': {
                  color: 'white',
                  transform: 'scale(1.1)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '4px',
                  height: '60%',
                  background: 'white',
                  borderRadius: '0 4px 4px 0',
                  boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
                },
                '&:hover': {
                  transform: 'translateX(5px)',
                  background: 'linear-gradient(135deg, #EB5E28 0%, #d94d1a 100%)',
                },
              },
            }}
          >
            <Users size={20} />
            <span>Teilnehmer</span>
          </Box>

          <Box
            as={Link}
            to="/tags"
            className={`nav-item ${isActive('/tags') ? 'active' : ''}`}
            position="relative"
            display="flex"
            alignItems="center"
            gap={{ base: '8px', sm: '10px', md: '12px' }}
            padding={{ base: '8px 10px', sm: '10px 14px', md: '12px 18px', lg: '14px 20px' }}
            color="#666"
            textDecoration="none"
            borderRadius={{ base: '10px', md: '12px' }}
            fontWeight={500}
            fontSize={{ base: '12px', sm: '14px', md: '15px' }}
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            _hover={{
              bg: 'rgba(235, 94, 40, 0.1)',
              color: '#EB5E28',
              transform: 'translateX(8px)',
              boxShadow: '0 4px 20px rgba(235, 94, 40, 0.15)',
            }}
            _dark={{
              color: '#cfcac3',
              _hover: {
                bg: 'rgba(235, 94, 40, 0.18)',
                color: '#EB5E28',
              },
            }}
            sx={{
              '&.active': {
                background: 'linear-gradient(135deg, #EB5E28 0%, #d94d1a 100%)',
                color: 'white',
                transform: 'translateX(5px)',
                boxShadow: '0 8px 25px rgba(235, 94, 40, 0.4)',
                '& svg': {
                  color: 'white',
                  transform: 'scale(1.1)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '4px',
                  height: '60%',
                  background: 'white',
                  borderRadius: '0 4px 4px 0',
                  boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
                },
                '&:hover': {
                  transform: 'translateX(5px)',
                  background: 'linear-gradient(135deg, #EB5E28 0%, #d94d1a 100%)',
                },
              },
            }}
          >
            <Tag size={20} />
            <span>Tags</span>
          </Box>
        </Flex>
      </chakra.aside>

      {/* Content Area */}
      <Box
        className="main-content"
        marginLeft={{ base: '180px', sm: '200px', md: '240px', lg: '280px' }}
        marginTop={{ base: '90px', md: '110px', lg: '120px' }}
        marginRight={{ base: '10px', md: '20px' }}
        padding={{ base: '15px', md: '20px' }}
        minH="calc(100vh - 140px)"
      >
        {children}
      </Box>
    </Box>
  );
};

